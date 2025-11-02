// js/dashboard.js (replace old file)
export async function loadUserProfile(username) {
  try {
    // Wait for DOM...
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

    // Show username quickly
    document.getElementById("username-display").textContent = username;

    // fetch avatar only
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
    // handle non-JSON or network errors gracefully
    let json = {};
    try {
      json = await res.json();
    } catch (e) {
      console.warn("Could not parse Steem API response", e);
      json = {};
    }
    const user = json.result?.[0];
    const metadata = JSON.parse(user?.posting_json_metadata || "{}");
    document.getElementById("profileImage").src =
      metadata.profile?.profile_image || "https://via.placeholder.com/100";

    // fetch DB stats (total, highest, next_allowed)
    const statsRes = await fetch(`php/get_user_stats.php?username=${encodeURIComponent(username)}`);
    const stats = await statsRes.json();

    const totalPoints = stats.total_points || 0;
    const highestScore = stats.highest_score || 0;

    const pointsEl = document.getElementById("userPoints");
    const repEl = document.getElementById("userReputation");

    // Update values
    // add animation class briefly when value changes
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

    // Rank & Level logic
    let level = 1;
    if (totalPoints >= 1000) level = 5;
    else if (totalPoints >= 500) level = 4;
    else if (totalPoints >= 250) level = 3;
    else if (totalPoints >= 100) level = 2;
    const levelLabel = ["Beginner 🐣","Explorer 🌿","Challenger 💪","Pro ⭐","Legend 🏆"][level-1];
    document.getElementById("userLevel").textContent = `Level ${level} – ${levelLabel}`;
    document.getElementById("userRank").textContent = `(${levelLabel})`;

    // Animate progress bar and add glow
    const progress = Math.min((totalPoints / 1000) * 100, 100);
    const bar = document.getElementById("progressBar");
    if (bar) {
      bar.style.transition = "width 1.2s ease-in-out";
      bar.style.width = `${progress}%`;
      // add glow, but keep it gentle
      bar.classList.add("glow-bar");
      // remove glow after a while to avoid permanent busy animation (optional)
      setTimeout(() => bar.classList.remove("glow-bar"), 3000);
    }

    // If the dashboard should show spin timer, forward next_allowed to an element (spinwheel listens)
    if (stats.next_allowed) {
      window.dispatchEvent(new CustomEvent('spinNextAllowedUpdated', { detail: { next_allowed: stats.next_allowed } }));
    }

  } catch (err) {
    console.error("Dashboard load error:", err);
    // No alert so UX not interrupted
  }
}

const user = localStorage.getItem("steemhop_user");
if (user) loadUserProfile(user);
