<?php
// php/get_points_log.php
include 'db.php';
header('Content-Type: application/json; charset=utf-8');

// Ensure username param present
$username = isset($_GET['username']) ? trim($_GET['username']) : '';

if ($username === '') {
  // Return empty array instead of an error object so frontend can handle uniformly
  echo json_encode([], JSON_UNESCAPED_UNICODE);
  $conn->close();
  exit;
}

try {
  $stmt = $conn->prepare("
    SELECT 
      source, 
      points, 
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at
    FROM points_log
    WHERE username = ?
    ORDER BY id DESC
  ");
  $stmt->bind_param("s", $username);
  $stmt->execute();
  $result = $stmt->get_result();

  $logs = [];
  while ($row = $result->fetch_assoc()) {
    // Ensure points are integers
    $row['points'] = (int)$row['points'];
    $logs[] = $row;
  }

  echo json_encode($logs, JSON_UNESCAPED_UNICODE);
  $stmt->close();
} catch (Exception $e) {
  // On error return empty array (frontend will show "No transactions yet" or similar)
  error_log("get_points_log error: " . $e->getMessage());
  echo json_encode([], JSON_UNESCAPED_UNICODE);
}

$conn->close();
