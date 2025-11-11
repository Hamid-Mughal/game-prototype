// 🏆 Steem Hop Leaderboard (Top 3 cards + Table)
let leaderboardLoaded = false; // ✅ Prevent double rendering

export async function loadLeaderboard(force = false) {
  if (leaderboardLoaded && !force) return;
  leaderboardLoaded = true;

  const top3Container = document.getElementById("top3Container");
  const leaderTable = document.getElementById("leaderTable");
  const currentUser =
    sessionStorage.getItem("steemhop_user")?.toLowerCase() || "";

  try {
    if (leaderTable) {
      leaderTable.innerHTML = `<tr><td colspan="4" class="text-center py-4 italic text-gray-500">
        Loading leaderboard...
      </td></tr>`;
    }
    if (top3Container) top3Container.innerHTML = "";

    const res = await fetch("php/get_leaderboard.php");
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    const rawData = await res.json();

    // ✅ Unique usernames
    const userMap = new Map();
    rawData.forEach((item) => {
      const uname = item.username?.toLowerCase().trim();
      if (!uname) return;
      const existing = userMap.get(uname);
      if (!existing || item.total_points > existing.total_points) {
        userMap.set(uname, item);
      }
    });

    const data = Array.from(userMap.values());
    data.sort((a, b) => b.total_points - a.total_points);

    const top20 = data.slice(0, 20);
    const top3 = top20.slice(0, 3);
    const rest = top20.slice(3);

    const profileCache = {};

    // 🧠 Function to get user profile image safely
    async function getProfile(username) {
      if (profileCache[username]) return profileCache[username];
      try {
        const steemRes = await fetch("https://api.steemit.com", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jsonrpc: "2.0",
            method: "condenser_api.get_accounts",
            params: [[username]],
            id: 1,
          }),
        });

        const json = await steemRes.json();
        const user = json.result?.[0];
        const meta = JSON.parse(user?.posting_json_metadata || "{}");

        let img = meta.profile?.profile_image;

        // 🧩 Smart fallback path detection (for local + production)
        let fallbackPath = "assets/dummypic.jpeg";
        if (window.location.pathname.includes("/js/")) {
          fallbackPath = "../assets/dummypic.jpeg";
        }

        if (!img || img.trim() === "" || img.includes("default")) {
          img = fallbackPath;
        }

        profileCache[username] = img;
        return img;
      } catch {
        // API failed — use fallback image
        let fallbackPath = "assets/dummypic.jpeg";
        if (window.location.pathname.includes("/js/")) {
          fallbackPath = "../assets/dummypic.jpeg";
        }
        return fallbackPath;
      }
    }

    function getLevel(points) {
      if (points >= 1000) return 5;
      else if (points >= 500) return 4;
      else if (points >= 250) return 3;
      else if (points >= 100) return 2;
      return 1;
    }

    // 🎖️ Render Top 3 Cards
    top3Container.innerHTML = "";
    for (let i = 0; i < top3.length; i++) {
      const item = top3[i];
      const username = item.username;
      const profileImg = await getProfile(username);
      const points = item.total_points;
      const level = getLevel(points);
      const emoji = i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉";

      // ✅ Highlight logged-in user
      const isCurrentUser = username.toLowerCase() === currentUser;
      const highlightClass = isCurrentUser
        ? "bg-[#FFF8DC] border-2 border-[#EAB308] shadow-lg scale-105"
        : "bg-white border border-[#EAB515]/70 shadow-md";

      const card = document.createElement("div");
      card.className = `flex flex-col items-center rounded-2xl p-3 sm:p-4 text-center transition-transform duration-300 hover:-translate-y-1 ${highlightClass}`;
      card.innerHTML = `
        <div class="text-xl sm:text-2xl text-[#D48905]">${emoji}</div>
        <img src="${profileImg}" alt="${username}"
             class="w-12 h-12 sm:w-20 sm:h-20 rounded-full border-4 border-[#EAB515] my-2 object-cover" />
        <div class="text-xs sm:text-xl text-[#D48905] font-semibold">${username}</div>
        <div class="text-xs font-semibold text-[#4b3a00]/70">Level ${level}</div>
        <div class="text-sm font-semibold text-[#EAB515]">${points} pts</div>
      `;
      top3Container.appendChild(card);
    }

    // 📋 Render Table (Ranks 4–20)
    leaderTable.innerHTML = "";
    for (let i = 0; i < rest.length; i++) {
      const item = rest[i];
      const username = item.username;
      const points = item.total_points;
      const level = getLevel(points);
      const rank = i + 4;
      const profileImg = await getProfile(username);

      const isCurrentUser = username.toLowerCase() === currentUser;

      const rowClass = isCurrentUser
        ? "bg-[#FFF8DC] border-[#EAB308]/70 shadow-sm"
        : i % 2 === 0
        ? "bg-[#FFFBEA]/50 border-b border-[#EAB515]/30"
        : "bg-white border-b border-[#EAB515]/30";

      leaderTable.innerHTML += `
        <tr class="${rowClass} hover:bg-[#FFF8DC]/60 transition">
          <td class="py-2 px-3 text-[#D48905] font-semibold">${rank}</td>
          <td class="py-2 px-3">
            <div class="flex items-center gap-2">
              <img src="${profileImg}" alt="${username}"
                   class="w-8 h-8 rounded-full border border-[#EAB515] object-cover" />
              <span class="text-[12px] sm:text-sm text-[#4b3a00]">${username}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-[12px] sm:text-sm  text-[#4b3a00]/80">Level ${level}</td>
          <td class="py-2 px-3 text-right text-[#EAB515] font-semibold">${points}</td>
        </tr>
      `;
    }
  } catch (err) {
    console.error("⚠️ Leaderboard error:", err);
    leaderTable.innerHTML = `<tr><td colspan="4" class="text-center py-4 text-red-600 italic">
      ⚠️ Unable to load leaderboard. Please try again.
    </td></tr>`;
  }
}

// ✅ Only first load happens automatically
if (!window._leaderboardEventsSet) {
  window._leaderboardEventsSet = true;
  loadLeaderboard();
  window.addEventListener("leaderboardUpdated", () => loadLeaderboard(true));
  window.addEventListener("pointsUpdated", () => loadLeaderboard(true));
  window.addEventListener("userSessionChanged", () => loadLeaderboard(true));
}
