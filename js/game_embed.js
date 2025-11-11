// js/game_embed.js

console.log("🎮 Steem Hop HTML5 Game Integration Loaded");

// Listen for messages from the game iframe
window.addEventListener("message", async (event) => {
  // ✅ Only accept messages from the same site
  if (!event.origin.includes(window.location.origin)) return;

  const data = event.data;
  if (!data || typeof data !== "object") return;

  // ✅ When the game sends final score
  if (data.type === "GAME_SCORE") {
    const username = sessionStorage.getItem("steemhop_user");
    const score = parseInt(data.score || 0);

    if (!username) {
      alert("⚠️ Please log in first.");
      return;
    }

    document.getElementById("scoreValue").textContent = score;

    try {
      const res = await fetch("php/save_score.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(username)}&score=${encodeURIComponent(score)}`
      });

      const json = await res.json();
      console.log("✅ Score saved:", json);

      if (json.success) {
        window.dispatchEvent(new Event("pointsUpdated"));
        window.dispatchEvent(new Event("leaderboardUpdated"));
      }
    } catch (err) {
      console.error("❌ Error saving score:", err);
    }
  }
});
