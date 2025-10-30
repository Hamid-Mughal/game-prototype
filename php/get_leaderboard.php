<?php
include 'db.php';

// Fetch username, score, and timestamp, top 10 highest
$result = $conn->query("SELECT username, score, created_at FROM leaderboard ORDER BY score DESC LIMIT 10");

$leaderboard = [];
while ($row = $result->fetch_assoc()) {
  $leaderboard[] = $row;
}

echo json_encode($leaderboard);
$conn->close();
?>
