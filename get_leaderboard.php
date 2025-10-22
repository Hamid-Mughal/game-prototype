<?php
include 'db.php';

$result = $conn->query("SELECT username, score FROM leaderboard ORDER BY score DESC LIMIT 10");

$leaderboard = [];
while ($row = $result->fetch_assoc()) {
  $leaderboard[] = $row;
}

echo json_encode($leaderboard);
?>
