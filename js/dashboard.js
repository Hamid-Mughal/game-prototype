// js/dashboard.js (reload-safe, multi-user version + rank + Steemit profile)
export async function loadUserProfile(username) {
  try {
    // ⏳ Wait for dashboard DOM to be ready before loading data
    await new Promise((resolve) => {
      const check = setInterval(() => {
        const ready =
          document.getElementById("profileImage") &&
          document.getElementById("userPoints") &&
          document.getElementById("userReputation") &&
          document.getElementById("progressBar") &&
          document.getElementById("username-display") &&
          document.getElementById("userRankDisplay") &&
          document.getElementById("userLevel");
        if (ready) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });

    console.log("✅ Dashboard DOM ready, loading user:", username);

    // 🧩 Display username immediately
    document.getElementById("username-display").textContent = username;

    // 🖼️ Fetch user avatar from Steemit API
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

    let json = {};
    try {
      json = await res.json();
    } catch (e) {
      console.warn("⚠️ Could not parse Steem API response", e);
    }

    const user = json.result?.[0];
    const metadata = JSON.parse(user?.posting_json_metadata || "{}");

    // 🧠 Smart Fallback Logic for Missing or Invalid Profile Images
    let profileImg = metadata.profile?.profile_image;

    // --- Intelligent Path Handling (works locally & live) ---
    let fallbackPath = "assets/dummypic.jpeg";
    // if page is served from a deeper path (like /js/)
    if (window.location.pathname.includes("/js/")) {
      fallbackPath = "../assets/dummypic.jpeg";
    }

    if (!profileImg || profileImg.trim() === "" || profileImg.includes("default")) {
      profileImg = fallbackPath;
    }

    // If fetching from Steem API fails, still use fallback
    if (!profileImg) {
      profileImg = fallbackPath;
    }

    document.getElementById("profileImage").src = profileImg;

    // 📊 Fetch user stats (total points, highest score, spin cooldown)
    const statsRes = await fetch(
      `php/get_user_stats.php?username=${encodeURIComponent(username)}`
    );
    const stats = await statsRes.json();

    const totalPoints = stats.total_points || 0;
    const highestScore = stats.highest_score || 0;

    const pointsEl = document.getElementById("userPoints");
    const repEl = document.getElementById("userReputation");

    // ✨ Smoothly update values
    if (pointsEl) {
      const previous = Number(pointsEl.textContent || 0);
      pointsEl.textContent = totalPoints;
      if (previous !== totalPoints) {
        pointsEl.classList.add("points-animate");
        setTimeout(() => pointsEl.classList.remove("points-animate"), 800);
      }
    }

    if (repEl) {
      const previousH = Number(repEl.textContent || 0);
      repEl.textContent = highestScore;
      if (previousH !== highestScore) {
        repEl.classList.add("points-animate");
        setTimeout(() => repEl.classList.remove("points-animate"), 800);
      }
    }

    // 🧮 Rank & Level Calculation
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

    document.getElementById(
      "userLevel"
    ).textContent = `Level ${level} – ${levelLabel}`;

    // 🌟 Animate progress bar
    const progress = Math.min((totalPoints / 1000) * 100, 100);
    const bar = document.getElementById("progressBar");
    if (bar) {
      bar.style.transition = "width 1.2s ease-in-out";
      bar.style.width = `${progress}%`;
      bar.classList.add("glow-bar");
      setTimeout(() => bar.classList.remove("glow-bar"), 3000);
    }

    // 🔄 Spin timer info (if available)
    if (stats.next_allowed) {
      window.dispatchEvent(
        new CustomEvent("spinNextAllowedUpdated", {
          detail: { next_allowed: stats.next_allowed },
        })
      );
    }

    // 🏅 Finally show leaderboard rank
    await updateUserRank(username);
  } catch (err) {
    console.error("❌ Dashboard load error:", err);
  }
}

// 🏆 Fetch and show user rank from leaderboard
async function updateUserRank(username) {
  try {
    const res = await fetch("php/get_leaderboard.php");
    if (!res.ok) throw new Error("Leaderboard fetch failed");
    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) return;

    const rankDisplay = document.getElementById("userRankDisplay");
    if (!rankDisplay) return;

    // 🔍 Find current user rank
    const userIndex = data.findIndex(
      (item) => item.username?.toLowerCase() === username.toLowerCase()
    );

    if (userIndex !== -1) {
      const userRank = userIndex + 1;

      // 🥇🥈🥉 emoji for top 3 ranks
      let rankEmoji = "";
      if (userRank === 1) rankEmoji = "🥇";
      else if (userRank === 2) rankEmoji = "🥈";
      else if (userRank === 3) rankEmoji = "🥉";

      // ✨ Display rank in right-aligned section
      rankDisplay.innerHTML = `
        <p class="text-lg sm:text-xl text-[#4b3a00]/70 font-semibold leading-tight">Rank</p>
        <span class="text-2xl sm:text-3xl font-extrabold text-[#D48905] leading-none">
          #${userRank}
        </span>
      `;
    } else {
      rankDisplay.innerHTML = `
        <p class="text-sm text-gray-500 italic leading-tight">No Rank Yet</p>
      `;
    }
  } catch (err) {
    console.error("⚠️ Rank fetch failed:", err);
  }
}

// ✅ Always load active session user when page opens
const user = sessionStorage.getItem("steemhop_user");
if (user) loadUserProfile(user);

// 🔄 Refresh dashboard rank automatically on updates
window.addEventListener("leaderboardUpdated", () => {
  const user = sessionStorage.getItem("steemhop_user");
  if (user) updateUserRank(user);
});

window.addEventListener("pointsUpdated", () => {
  const user = sessionStorage.getItem("steemhop_user");
  if (user) updateUserRank(user);
});

window.addEventListener("userSessionChanged", () => {
  const user = sessionStorage.getItem("steemhop_user");
  if (user) updateUserRank(user);
});

// 🚀 Auto-load again on full page reload (DOM-safe)
window.addEventListener("load", () => {
  const user = sessionStorage.getItem("steemhop_user");
  if (user) {
    setTimeout(() => loadUserProfile(user), 800); // ensures DOM is ready after reload
  }
});
