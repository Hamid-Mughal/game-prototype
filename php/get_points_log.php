<?php
include 'db.php';
header('Content-Type: application/json');

$username = $_GET['username'] ?? '';

if (empty($username)) {
  echo json_encode(["error" => "Username missing"]);
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
    $logs[] = $row;
  }

  echo json_encode($logs);
} catch (Exception $e) {
  echo json_encode(["error" => $e->getMessage()]);
}

$conn->close();
?>
