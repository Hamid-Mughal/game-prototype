<?php
// php/get_user_stats.php
include 'db.php';
header('Content-Type: application/json; charset=utf-8');

$username = isset($_GET['username']) ? trim($_GET['username']) : '';
if ($username === '') {
  echo json_encode(["error" => "No username provided"]);
  exit;
}

// total + highest
$stmt = $conn->prepare("
  SELECT COALESCE(SUM(score),0) AS total_points, COALESCE(MAX(score),0) AS highest_score
  FROM leaderboard WHERE username = ?
");
$stmt->bind_param("s", $username);
$stmt->execute();
$res = $stmt->get_result()->fetch_assoc();
$stmt->close();

// next allowed
$nextAllowed = null;
$q = $conn->prepare("SELECT last_spin FROM user_spins WHERE username = ?");
$q->bind_param("s", $username);
$q->execute();
$r = $q->get_result();
if ($row = $r->fetch_assoc()) {
  if ($row['last_spin']) {
    $last_ts = strtotime($row['last_spin']);
    $nextAllowed = $last_ts + 7*24*60*60; // 7 days
  }
}
$q->close();

echo json_encode([
  "username" => $username,
  "total_points" => (int)$res['total_points'],
  "highest_score" => (int)$res['highest_score'],
  "next_allowed" => $nextAllowed // null or unix timestamp
]);

$conn->close();
