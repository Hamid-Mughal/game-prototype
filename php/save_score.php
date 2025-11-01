<?php
include 'db.php';
header('Content-Type: application/json');

$username = $_POST['username'] ?? '';
$score = intval($_POST['score'] ?? 0);

if (empty($username)) {
  echo json_encode(["success" => false, "message" => "Missing username"]);
  exit;
}

try {
  // ✅ Save to leaderboard
  $stmt = $conn->prepare("INSERT INTO leaderboard (username, score, created_at) VALUES (?, ?, NOW())");
  $stmt->bind_param("si", $username, $score);
  $stmt->execute();
  $stmt->close();

  // ✅ Also log this in points_log
  $logStmt = $conn->prepare("INSERT INTO points_log (username, source, points, created_at) VALUES (?, 'game', ?, NOW())");
  $logStmt->bind_param("si", $username, $score);
  $logStmt->execute();
  $logStmt->close();

  // ✅ Update user total points (optional)
  $sumQuery = $conn->prepare("SELECT COALESCE(SUM(score), 0) AS total FROM leaderboard WHERE username = ?");
  $sumQuery->bind_param("s", $username);
  $sumQuery->execute();
  $total = $sumQuery->get_result()->fetch_assoc()['total'];
  $sumQuery->close();

  echo json_encode([
    "success" => true,
    "message" => "Game score saved and logged successfully.",
    "total_points" => $total
  ]);
} catch (Exception $e) {
  echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

$conn->close();
?>
