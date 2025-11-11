<?php
// php/get_leaderboard.php — unified leaderboard (unique usernames)
include 'db.php';
header('Content-Type: application/json; charset=utf-8');

try {
  // ✅ Unique usernames (case-insensitive, trim spaces)
  $sql = "
    SELECT 
      LOWER(TRIM(p.username)) AS username,
      COALESCE(SUM(p.points), 0) AS total_points,
      COALESCE(MAX(CASE WHEN p.source = 'game' THEN p.points ELSE NULL END), 0) AS highest_score,
      COUNT(CASE WHEN p.source = 'game' THEN 1 END) AS games_played,
      MAX(p.created_at) AS last_played
    FROM points_log p
    WHERE TRIM(p.username) <> ''
    GROUP BY LOWER(TRIM(p.username))
    ORDER BY total_points DESC, highest_score DESC, last_played DESC
    LIMIT 100
  ";

  $result = $conn->query($sql);

  $leaderboard = [];
  while ($row = $result->fetch_assoc()) {
    $leaderboard[] = [
      "username"      => $row["username"],
      "total_points"  => (int)$row["total_points"],
      "highest_score" => (int)$row["highest_score"],
      "games_played"  => (int)$row["games_played"],
      "last_played"   => $row["last_played"]
    ];
  }

  echo json_encode($leaderboard, JSON_UNESCAPED_UNICODE);
} catch (Exception $e) {
  error_log("get_leaderboard error: " . $e->getMessage());
  echo json_encode(["error" => "DB Error: " . $e->getMessage()]);
}

$conn->close();
?>
