<?php
$host = "localhost";    // usually localhost
$user = "root";         // default for XAMPP
$pass = "";             // keep empty unless you've set a password
$dbname = "crossy_road_db"; // your database name

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
