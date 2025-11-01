<?php
include 'db.php';
header('Content-Type: application/json');

$username = $_POST['username'] ?? '';
$score = intval($_POST['score'] ?? 0);

if (empty($username)) {
  echo json_encode(["success" => false, "message" => "Missing username"]);
  exit;
}

// ✅ Get last spin time (limit 7 days)
$stmt = $conn->prepare("SELECT created_at FROM points_log WHERE username = ? AND source = 'spin' ORDER BY id DESC LIMIT 1");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();
$lastSpin = $result->fetch_assoc()['created_at'] ?? null;
$stmt->close();

$now = time();
if ($lastSpin) {
  $diff = $now - strtotime($lastSpin);
  if ($diff < 7 * 24 * 3600) {
    $next = strtotime($lastSpin) + 7 * 24 * 3600;
    echo json_encode([
      "success" => false,
      "message" => "Spin already used this week",
      "next_allowed" => $next
    ]);
    exit;
  }
}

try {
  // ✅ Save spin points to leaderboard
  $stmt = $conn->prepare("INSERT INTO leaderboard (username, score, created_at) VALUES (?, ?, NOW())");
  $stmt->bind_param("si", $username, $score);
  $stmt->execute();
  $stmt->close();

  // ✅ Log spin in points_log
  $logStmt = $conn->prepare("INSERT INTO points_log (username, source, points, created_at) VALUES (?, 'spin', ?, NOW())");
  $logStmt->bind_param("si", $username, $score);
  $logStmt->execute();
  $logStmt->close();

  // ✅ Get new total
  $sumStmt = $conn->prepare("SELECT COALESCE(SUM(score), 0) AS total FROM leaderboard WHERE username = ?");
  $sumStmt->bind_param("s", $username);
  $sumStmt->execute();
  $total = $sumStmt->get_result()->fetch_assoc()['total'];
  $sumStmt->close();

  $nextAllowed = $now + 7 * 24 * 3600;

  echo json_encode([
    "success" => true,
    "message" => "Spin saved successfully!",
    "total_points" => $total,
    "next_allowed" => $nextAllowed
  ]);
} catch (Exception $e) {
  echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>
