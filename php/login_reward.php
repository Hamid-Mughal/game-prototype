<?php
// php/login_reward.php — fixed: login points ONLY in points_log
include 'db.php';
header('Content-Type: application/json; charset=utf-8');

$username = $_POST['username'] ?? '';

if (!$username) {
  echo json_encode(["success" => false, "message" => "❌ No username provided"]);
  exit;
}

// ✅ Check last login reward from points_log (only)
$stmt = $conn->prepare("
  SELECT created_at 
  FROM points_log 
  WHERE username = ? AND source = 'login'
  ORDER BY id DESC LIMIT 1
");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();
$stmt->close();

$now = time();
$rewardAllowed = false;

if ($result && isset($result['created_at'])) {
  $lastLogin = strtotime($result['created_at']);
  $diff = $now - $lastLogin;

  // ✅ Allow only after 24 hours
  if ($diff >= 86400) {
    $rewardAllowed = true;
  }
} else {
  // First login ever
  $rewardAllowed = true;
}

if ($rewardAllowed) {
  $points = 10;

  // ✅ 1. Remove leaderboard insert (old behavior removed)
  // 🚫 No leaderboard insertion for login rewards

  // ✅ 2. Add to transaction log only
  $log = $conn->prepare("
    INSERT INTO points_log (username, source, points, created_at)
    VALUES (?, 'login', ?, NOW())
  ");
  $log->bind_param("si", $username, $points);
  $log->execute();
  $log->close();

  // ✅ 3. Fetch total points (from points_log)
  $sumStmt = $conn->prepare("
    SELECT COALESCE(SUM(points), 0) AS total_points 
    FROM points_log 
    WHERE username = ?
  ");
  $sumStmt->bind_param("s", $username);
  $sumStmt->execute();
  $sumResult = $sumStmt->get_result()->fetch_assoc();
  $totalPoints = $sumResult['total_points'] ?? 0;
  $sumStmt->close();

  echo json_encode([
    "success" => true,
    "points_awarded" => $points,
    "total_points" => $totalPoints,
    "message" => "🎉 You received 10 daily login points!"
  ]);
} else {
  echo json_encode([
    "success" => false,
    "message" => "⏳ You already received today's login reward."
  ]);
}

$conn->close();
?>
