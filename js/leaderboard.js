// js/leaderboard.js
export async function loadLeaderboard() {
  try {
    const res = await fetch("php/get_leaderboard.php");
    if (!res.ok) throw new Error("Failed to load leaderboard data");
    const data = await res.json();

    const leaderList = document.getElementById("leaderList");
    if (!leaderList) return;
    leaderList.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      leaderList.innerHTML = "<li class='text-gray-600 italic'>No players yet.</li>";
      return;
    }

    data.forEach((item, index) => {
      const username = item.username || 'Unknown';
      const totalPoints = Number(item.total_points || 0);
      const highestScore = Number(item.highest_score || 0);
      const gamesPlayed = Number(item.games_played || 0);
      const formattedDate = item.last_played ? new Date(item.last_played).toLocaleString() : 'N/A';

      const rankEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index+1}.`;

      const li = document.createElement('li');
      li.className = "flex items-center justify-between p-3 bg-white border border-[#EAB515]/30 rounded-lg";
      li.innerHTML = `
        <div class="flex items-center gap-3">
          <span class="font-bold text-[#D48905]">${rankEmoji}</span>
          <span class="font-semibold text-[#4b3a00]">${username}</span>
        </div>
        <div class="text-right">
          <div class="font-bold text-[#EAB515]">${totalPoints} pts</div>
          <div class="text-xs text-[#4b3a00]/70">High: ${highestScore}</div>
           <div class="text-xs text-[#4b3a00]/70">Games: ${gamesPlayed}</div>
          <div class="text-[10px] text-[#4b3a00]/50">${formattedDate}</div>
        </div>
      `;
      leaderList.appendChild(li);
    });
  } catch (err) {
    console.error("Leaderboard load error:", err);
    const leaderList = document.getElementById("leaderList");
    if (leaderList) leaderList.innerHTML = "<li class='text-red-600'>Unable to load leaderboard.</li>";
  }
}

// auto load
loadLeaderboard();
// reload when someone spins
window.addEventListener('leaderboardUpdated', () => loadLeaderboard());
// also optionally auto-refresh every 30 seconds:
setInterval(loadLeaderboard, 30000);
