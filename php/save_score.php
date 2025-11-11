<?php
// ✅ Include existing DB connection
include 'db.php';
header('Content-Type: application/json; charset=utf-8');

// ✅ Collect POST data safely
$username = trim($_POST['username'] ?? '');
$score    = intval($_POST['score'] ?? 0);
$coins    = intval($_POST['coins'] ?? 0);

// ✅ Validate input
if (empty($username)) {
    echo json_encode([
        "success" => false,
        "message" => "⚠️ Missing username"
    ]);
    exit;
}

// ✅ Begin processing
try {

    // ✅ Save to leaderboard (records game score)
    $stmt = $conn->prepare("
        INSERT INTO leaderboard (username, score, coins, created_at) 
        VALUES (?, ?, ?, NOW())
    ");
    $stmt->bind_param("sii", $username, $score, $coins);
    $stmt->execute();
    $stmt->close();

    // ✅ Log points in points_log (for total balance / rewards)
    $logStmt = $conn->prepare("
        INSERT INTO points_log (username, source, points, created_at) 
        VALUES (?, 'game', ?, NOW())
    ");
    $logStmt->bind_param("si", $username, $score);
    $logStmt->execute();
    $logStmt->close();

    // ✅ Fetch total earned points for this user
    $sumStmt = $conn->prepare("
        SELECT COALESCE(SUM(points), 0) AS total 
        FROM points_log 
        WHERE username = ?
    ");
    $sumStmt->bind_param("s", $username);
    $sumStmt->execute();
    $result = $sumStmt->get_result();
    $total  = $result->fetch_assoc()['total'] ?? 0;
    $sumStmt->close();

    // ✅ Optionally, update user's coin balance if you have a 'users' table
    // Uncomment if your users table has 'coins' field:
    /*
    $updateCoins = $conn->prepare("UPDATE users SET coins = coins + ? WHERE username = ?");
    $updateCoins->bind_param("is", $coins, $username);
    $updateCoins->execute();
    $updateCoins->close();
    */

    // ✅ Return JSON response
    echo json_encode([
        "success"       => true,
        "message"       => "🎯 Game score saved successfully.",
        "username"      => $username,
        "score"         => $score,
        "coins"         => $coins,
        "total_points"  => $total
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {

    // ❌ Handle any runtime error gracefully
    echo json_encode([
        "success" => false,
        "message" => "❌ Error: " . $e->getMessage()
    ]);
}

// ✅ Close DB connection
$conn->close();
?>
