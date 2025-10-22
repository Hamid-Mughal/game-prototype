<?php
include 'db.php';

$username = $_POST['username'] ?? '';
$score = $_POST['score'] ?? 0;

if ($username && $score) {
  $stmt = $conn->prepare("INSERT INTO leaderboard (username, score) VALUES (?, ?)");
  $stmt->bind_param("si", $username, $score);
  
  if ($stmt->execute()) {
    echo "✅ Score saved!";
  } else {
    echo "❌ Error saving score.";
  }
} else {
  echo "⚠️ Invalid data.";
}
?>
