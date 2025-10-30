async function loadLeaderboard() {
  const res = await fetch("php/get_leaderboard.php");
  const data = await res.json();
  const leaderList = document.getElementById("leaderList");
  leaderList.innerHTML = "";

  data.forEach(item => {
    const formattedDate = item.created_at
      ? new Date(item.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
      : "N/A";

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="flex flex-col sm:flex-row sm:items-center justify-between">
        <div><b>${item.username}</b> — ${item.score} pts</div>
        <span class="text-xs text-gray-500 mt-1 sm:mt-0 sm:ml-2">${formattedDate}</span>
      </div>`;
    leaderList.appendChild(li);
  });
}
loadLeaderboard();
