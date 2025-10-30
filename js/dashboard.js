export async function loadUserProfile(username) {
  try {
    // 🕒 Wait until dashboard HTML is fully loaded
    await new Promise((resolve) => {
      const check = setInterval(() => {
        if (
          document.getElementById("profileImage") &&
          document.getElementById("userPoints") &&
          document.getElementById("userReputation") &&
          document.getElementById("progressBar") &&
          document.getElementById("username-display") &&
          document.getElementById("userRank")
        ) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });

    // ✅ Immediately show username while data loads
    document.getElementById("username-display").textContent = username;

    // ✅ Fetch Steem user profile
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

    if (!res.ok) throw new Error("Network error: " + res.status);

    const json = await res.json();

    // ✅ Handle empty / invalid response
    if (!json.result || !json.result.length) {
      alert("⚠️ No user found for: " + username);
      return;
    }

    const user = json.result[0];
    const metadata = JSON.parse(user.posting_json_metadata || "{}");

    const profileImg =
      metadata.profile?.profile_image || "https://via.placeholder.com/100";
    const reputation = Math.floor(user.reputation / 1000000);
    const rank =
      reputation >= 70
        ? "Legend 🏆"
        : reputation >= 60
        ? "Pro ⭐"
        : "Newbie 🐣";
    const points = user.posting_rewards || 0;

    // ✅ Update UI safely
    document.getElementById("profileImage").src = profileImg;
    document.getElementById("userReputation").textContent = reputation;
    document.getElementById("userPoints").textContent = points;
    document.getElementById("userRank").textContent = `(${rank})`;

    // ✅ Animate progress bar
    // const progress = Math.min(Math.max(reputation, 0), 100);
    // const bar = document.getElementById("progressBar");
    // bar.style.transition = "width 1.2s ease-in-out";
    // bar.style.width = `${progress}%`;

    console.log("✅ Profile loaded successfully for:", username);
  } catch (err) {
    console.error("⚠️ Profile load error:", err);
    alert("⚠️ Unable to load Steem profile data for " + username);
  }
}

// ✅ Auto-run if user already logged in
const user = localStorage.getItem("steemhop_user");
if (user) loadUserProfile(user);
