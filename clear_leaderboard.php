<?php
include 'db.php';

$sql = "TRUNCATE TABLE leaderboard";

if ($conn->query($sql) === TRUE) {
  echo "✅ Leaderboard cleared successfully!";
} else {
  echo "❌ Error clearing leaderboard: " . $conn->error;
}
?>
