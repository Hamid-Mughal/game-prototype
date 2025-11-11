<?php
// php/get_user_stats.php — unified user stats (game + spin + login totals)
include 'db.php';
header('Content-Type: application/json; charset=utf-8');

$username = $_GET['username'] ?? '';

if (empty($username)) {
  echo json_encode(["error" => "No username provided"]);
  exit;
}

try {
  // ✅ 1. Total points (sum of all sources)
  $totalStmt = $conn->prepare("
    SELECT COALESCE(SUM(points), 0) AS total_points 
    FROM points_log 
    WHERE username = ?
  ");
  $totalStmt->bind_param("s", $username);
  $totalStmt->execute();
  $totalRes = $totalStmt->get_result()->fetch_assoc();
  $totalPoints = $totalRes['total_points'] ?? 0;
  $totalStmt->close();

  // ✅ 2. Highest game score (from leaderboard only)
  $highStmt = $conn->prepare("
    SELECT COALESCE(MAX(score), 0) AS highest_score 
    FROM leaderboard 
    WHERE username = ?
  ");
  $highStmt->bind_param("s", $username);
  $highStmt->execute();
  $highRes = $highStmt->get_result()->fetch_assoc();
  $highestScore = $highRes['highest_score'] ?? 0;
  $highStmt->close();

  // ✅ 3. Spin cooldown (24 h)
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
    $nextAllowed = strtotime($spinRes['created_at']) + 24 * 3600;
  }

  // ✅ Return unified stats
  echo json_encode([
    "username"      => $username,
    "total_points"  => (int)$totalPoints,
    "highest_score" => (int)$highestScore,
    "next_allowed"  => $nextAllowed
  ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
  error_log("get_user_stats error: " . $e->getMessage());
  echo json_encode(["error" => "DB Error: " . $e->getMessage()]);
}

$conn->close();
?>
