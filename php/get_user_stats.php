<?php
include 'db.php';
header('Content-Type: application/json');

$username = $_GET['username'] ?? '';

if (empty($username)) {
  echo json_encode(["error" => "No username provided"]);
  exit;
}

try {
  // ✅ Fetch user total and highest score
  $stmt = $conn->prepare("
    SELECT 
      COALESCE(SUM(score), 0) AS total_points,
      COALESCE(MAX(score), 0) AS highest_score
    FROM leaderboard
    WHERE username = ?
  ");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result()->fetch_assoc();
  $stmt->close();

  // ✅ Get last spin info for optional cooldown display
  $spinStmt = $conn->prepare("
    SELECT created_at 
    FROM points_log 
    WHERE username = ? AND source = 'spin'
    ORDER BY id DESC LIMIT 1
  ");
  $spinStmt->bind_param("s", $username);
  $spinStmt->execute();
  $spinRes = $spinStmt->get_result()->fetch_assoc();
  $spinStmt->close();

  $nextAllowed = null;
  if (!empty($spinRes['created_at'])) {
    $nextAllowed = strtotime($spinRes['created_at']) + 7 * 24 * 3600;
  }

  echo json_encode([
    "username" => $username,
    "total_points" => (int) $result['total_points'],
    "highest_score" => (int) $result['highest_score'],
    "next_allowed" => $nextAllowed
  ]);

} catch (Exception $e) {
  echo json_encode(["error" => "DB Error: " . $e->getMessage()]);
}

$conn->close();
?>
