<?php
$host = "localhost";    // usually localhost
$user = "root";         // default for XAMPP
$pass = "";             // leave empty unless you set a password
$dbname = "steemhop";   // ✅ your new database name

// Create connection
$conn = new mysqli($host, $user, $pass, $dbname);

// Check connection
if ($conn->connect_error) {
  die("❌ Connection failed: " . $conn->connect_error);
} else {
  // Optional: confirmation message (you can remove later)
  // echo "✅ Connected successfully to steemhop database!";
}
?>
