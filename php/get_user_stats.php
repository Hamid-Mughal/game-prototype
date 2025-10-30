<?php
include 'db.php';

// ✅ Get username from request
$username = isset($_GET['username']) ? trim($_GET['username']) : '';

if ($username === '') {
  echo json_encode(["error" => "❌ No username provided"]);
  exit;
}

// ✅ Fetch total and highest scores from DB
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

echo json_encode([
  "username" => $username,
  "total_points" => (int) $result['total_points'],
  "highest_score" => (int) $result['highest_score']
]);

$conn->close();
?>
