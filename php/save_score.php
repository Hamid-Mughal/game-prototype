<?php
include 'db.php';

$username = $_POST['username'] ?? '';
$score = $_POST['score'] ?? 0;

if ($username && $score) {
  // Insert with timestamp
  $stmt = $conn->prepare("INSERT INTO leaderboard (username, score, created_at) VALUES (?, ?, NOW())");
  $stmt->bind_param("si", $username, $score);
  
  if ($stmt->execute()) {
    echo "✅ Score saved!";
  } else {
    echo "❌ Error saving score.";
  }
  $stmt->close();
} else {
  echo "⚠️ Invalid data.";
}
$conn->close();
?>
