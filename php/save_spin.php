<?php
// php/save_spin.php
include 'db.php';
header('Content-Type: application/json; charset=utf-8');

$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$score = isset($_POST['score']) ? intval($_POST['score']) : 0;

if ($username === '') {
  echo json_encode(["success" => false, "message" => "Missing username"]);
  $conn->close();
  exit;
}

// normalize negative scores
if ($score < 0) $score = 0;

try {
  // ✅ Check last spin time (24-hour cooldown)
  $stmt = $conn->prepare("SELECT created_at FROM points_log WHERE username = ? AND source = 'spin' ORDER BY id DESC LIMIT 1");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result();
  $lastRow = $result->fetch_assoc();
  $stmt->close();

  $now = time();
  $lastSpin = isset($lastRow['created_at']) ? strtotime($lastRow['created_at']) : null;

  if ($lastSpin) {
    $diff = $now - $lastSpin;
    if ($diff < 24 * 3600) { // less than 24 hours → deny
      $next = $lastSpin + 24 * 3600;
      echo json_encode([
        "success" => false,
        "message" => "Spin already used today!",
        "next_allowed" => $next
      ], JSON_UNESCAPED_UNICODE);
      $conn->close();
      exit;
    }
  }

  // ✅ Only log spin, don't affect leaderboard
  $conn->begin_transaction();

  $logStmt = $conn->prepare("INSERT INTO points_log (username, source, points, created_at) VALUES (?, 'spin', ?, NOW())");
  $logStmt->bind_param("si", $username, $score);
  $logStmt->execute();
  $logStmt->close();

  $conn->commit();

  // ✅ Compute total points (sum of all sources)
  $sumStmt = $conn->prepare("
    SELECT COALESCE(SUM(points), 0) AS total_points 
    FROM points_log 
    WHERE username = ?
  ");
  $sumStmt->bind_param("s", $username);
  $sumStmt->execute();
  $sumResult = $sumStmt->get_result()->fetch_assoc();
  $totalPoints = (int)($sumResult['total_points'] ?? 0);
  $sumStmt->close();

  $nextAllowed = $now + 24 * 3600;

  echo json_encode([
    "success" => true,
    "message" => "Spin saved successfully!",
    "total_points" => $totalPoints,
    "next_allowed" => $nextAllowed
  ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
  if ($conn->errno) $conn->rollback();
  error_log("save_spin error: " . $e->getMessage());
  echo json_encode(["success" => false, "message" => "Error saving spin."]);
}

$conn->close();
?>
