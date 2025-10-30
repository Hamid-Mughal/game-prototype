// js/leaderboard.js
// Auto-refreshing leaderboard (safe to include multiple times)

async function loadLeaderboard() {
  try {
    const res = await fetch("php/get_leaderboard.php");
    if (!res.ok) throw new Error("Failed to load leaderboard data (HTTP " + res.status + ")");

    const data = await res.json();
    console.log("✅ Leaderboard Data:", data);

    const leaderList = document.getElementById("leaderList");
    if (!leaderList) {
      console.warn("Leaderboard element not found (#leaderList).");
      return;
    }

    leaderList.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      leaderList.innerHTML = `<li class='text-gray-600 italic'>No players found yet.</li>`;
      return;
    }

    data.forEach((item, index) => {
      const username = item.username || "Unknown";
      const totalPoints = Number(item.total_points || 0);
      const highestScore = Number(item.highest_score || 0);
      const gamesPlayed = Number(item.games_played || 0);
      const formattedDate = item.last_played
        ? new Date(item.last_played).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
        : "N/A";

      const rankEmoji = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;

      const li = document.createElement("li");
      li.className =
        "flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-[#EAB515]/30 p-4 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300";

      li.innerHTML = `
        <div class="flex items-center gap-3">
          <b class="text-[#D48905] text-xl">${index + 1}</b>
          <span class="text-lg font-bold text-[#4b3a00]">${rankEmoji}</span>
          <b class="text-[#D48905]">${username}</b>
        </div>
        <div class="text-right">
          <span class="text-[#EAB515] font-bold">${totalPoints} pts</span>
          <span class="block text-xs text-[#4b3a00]/70">High: ${highestScore}</span>
          <span class="block text-[10px] text-[#4b3a00]/50">Games: ${gamesPlayed}</span>
          <span class="block text-[10px] text-[#4b3a00]/50">${formattedDate}</span>
        </div>
      `;

      leaderList.appendChild(li);
    });
  } catch (err) {
    console.error("⚠️ Leaderboard error:", err);
    const leaderList = document.getElementById("leaderList");
    if (leaderList) {
      leaderList.innerHTML = "<li class='text-red-600 font-semibold'>⚠️ Unable to load leaderboard data.</li>";
    }
  }
}

// Auto-refresh control (stored on window so multiple injections won't create duplicate timers)
function startLeaderboardAutoRefresh(intervalMs = 30000) {
  // clear existing timer if present
  if (window.leaderboardAutoRefreshTimer) {
    clearInterval(window.leaderboardAutoRefreshTimer);
    window.leaderboardAutoRefreshTimer = null;
  }

  // run immediately, then set interval
  loadLeaderboard().catch((e) => console.warn("Initial leaderboard load failed:", e));
  window.leaderboardAutoRefreshTimer = setInterval(() => {
    loadLeaderboard().catch((e) => console.warn("Auto-refresh load failed:", e));
  }, intervalMs);

  console.log("🔁 Leaderboard auto-refresh started (every " + (intervalMs/1000) + "s)");
}

function stopLeaderboardAutoRefresh() {
  if (window.leaderboardAutoRefreshTimer) {
    clearInterval(window.leaderboardAutoRefreshTimer);
    window.leaderboardAutoRefreshTimer = null;
    console.log("⏸️ Leaderboard auto-refresh stopped");
  }
}

// Pause auto-refresh when tab is hidden, resume when visible
function handleVisibilityChange() {
  if (document.hidden) {
    stopLeaderboardAutoRefresh();
  } else {
    // resume with 30s interval
    startLeaderboardAutoRefresh(30000);
  }
}

// Safety: clear timer on unload
function cleanupOnUnload() {
  stopLeaderboardAutoRefresh();
  document.removeEventListener("visibilitychange", handleVisibilityChange);
  window.removeEventListener("beforeunload", cleanupOnUnload);
}

// Start auto-refresh when module script runs (if it isn't already running)
if (!window.leaderboardAutoRefreshTimer) {
  // start with 30 seconds
  startLeaderboardAutoRefresh(30000);

  // visibility handling
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // cleanup
  window.addEventListener("beforeunload", cleanupOnUnload);
}

// Export for manual control if ever needed
export { loadLeaderboard, startLeaderboardAutoRefresh, stopLeaderboardAutoRefresh };
