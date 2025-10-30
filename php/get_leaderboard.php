<?php
include 'db.php';

$query = "
  SELECT 
    username,
    SUM(score) AS total_points,
    MAX(score) AS highest_score,
    COUNT(*) AS games_played,
    MAX(created_at) AS last_played
  FROM leaderboard
  GROUP BY username
  ORDER BY total_points DESC
  LIMIT 20
";

$result = $conn->query($query);

$leaderboard = [];
while ($row = $result->fetch_assoc()) {
  $leaderboard[] = $row;
}

echo json_encode($leaderboard, JSON_PRETTY_PRINT);
$conn->close();
?>
