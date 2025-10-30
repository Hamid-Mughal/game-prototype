export async function loadUserProfile(username) {
  try {
    // Wait until dashboard DOM is ready
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (
          document.getElementById("profileImage") &&
          document.getElementById("userPoints") &&
          document.getElementById("userReputation") &&
          document.getElementById("progressBar") &&
          document.getElementById("username-display") &&
          document.getElementById("userRank") &&
          document.getElementById("userLevel")
        ) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });

    // Show username instantly
    document.getElementById("username-display").textContent = username;

    // Fetch profile image from Steem
    const res = await fetch("https://api.steemit.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "condenser_api.get_accounts",
        params: [[username]],
        id: 1,
      }),
    });

    const json = await res.json();
    const user = json.result?.[0];
    const metadata = JSON.parse(user?.posting_json_metadata || "{}");
    const profileImg =
      metadata.profile?.profile_image || "https://via.placeholder.com/100";
    document.getElementById("profileImage").src = profileImg;

    // Fetch user stats from DB
    const statsRes = await fetch(`php/get_user_stats.php?username=${username}`);
    const stats = await statsRes.json();

    const totalPoints = stats.total_points || 0;
    const highestScore = stats.highest_score || 0;

    // Update score UI
    document.getElementById("userPoints").textContent = totalPoints;
    document.getElementById("userReputation").textContent = highestScore;

    // Rank logic
    const rank =
      highestScore >= 1000
        ? "Legend 🏆"
        : highestScore >= 500
        ? "Pro ⭐"
        : highestScore >= 250
        ? "Challenger 💪"
        : highestScore >= 100
        ? "Explorer 🌿"
        : "Beginner 🐣";

    document.getElementById("userRank").textContent = `(${rank})`;

    // ✅ New Level System (based on total points)
    let level = 1;
    if (totalPoints >= 1000) level = 5;
    else if (totalPoints >= 500) level = 4;
    else if (totalPoints >= 250) level = 3;
    else if (totalPoints >= 100) level = 2;

    const levelLabel = [
      "Beginner 🐣",
      "Explorer 🌿",
      "Challenger 💪",
      "Pro ⭐",
      "Legend 🏆",
    ][level - 1];

    document.getElementById("userLevel").textContent = `Level ${level} – ${levelLabel}`;
     document.getElementById("userRank").textContent = `(${levelLabel})`;

    // Animate progress bar based on total points
    const progress = Math.min((totalPoints / 1000) * 100, 100);
    const bar = document.getElementById("progressBar");
    bar.style.transition = "width 1.2s ease-in-out";
    bar.style.width = `${progress}%`;

    console.log(`✅ Dashboard loaded for ${username}: Level ${level}, Points=${totalPoints}, High=${highestScore}`);
  } catch (err) {
    console.error("⚠️ Dashboard load error:", err);
    alert("⚠️ Unable to load dashboard data.");
  }
}

const user = localStorage.getItem("steemhop_user");
if (user) loadUserProfile(user);
