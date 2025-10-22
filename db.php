<?php
$host = "localhost";  // usually localhost
$user = "root";       // default in XAMPP
$pass = "";           // leave blank (unless you set a password)
$dbname = "crossy_road_db"; // your database name

$conn = new mysqli($host, $user, $pass, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}
?>
