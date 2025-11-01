<?php
include 'db.php';

$username = $_POST['username'] ?? '';

if (!$username) {
  echo json_encode(["success" => false, "message" => "No username provided"]);
  exit;
}

// ✅ Check last login reward
$stmt = $conn->prepare("SELECT last_login_reward FROM leaderboard WHERE username = ? ORDER BY id DESC LIMIT 1");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

$now = new DateTime();
$rewardAllowed = false;

if ($result && $result['last_login_reward']) {
  $lastReward = new DateTime($result['last_login_reward']);
  $diff = $now->getTimestamp() - $lastReward->getTimestamp();

  if ($diff >= 86400) { // 24 hours
    $rewardAllowed = true;
  }
} else {
  // No record found → first login ever
  $rewardAllowed = true;
}

if ($rewardAllowed) {
  $points = 10;

  // ✅ Save in leaderboard
  $stmt2 = $conn->prepare("INSERT INTO leaderboard (username, score, created_at, last_login_reward) VALUES (?, ?, NOW(), NOW())");
  $stmt2->bind_param("si", $username, $points);
  $stmt2->execute();

  // ✅ Add to points log
  $log = $conn->prepare("INSERT INTO points_log (username, source, points) VALUES (?, 'login', ?)");
  $log->bind_param("si", $username, $points);
  $log->execute();

  echo json_encode([
    "success" => true,
    "points_awarded" => $points,
    "message" => "🎉 You received 10 daily login points!"
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "You already received login reward in last 24 hours."
  ]);
}

$conn->close();
?>
