// js/report.js
export async function loadReports() {
  const user = localStorage.getItem("steemhop_user");
  const tableBody = document.getElementById("pointsLogTable");

  if (!tableBody) {
    console.error("❌ Table body element (#pointsLogTable) not found.");
    return;
  }

  if (!user) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-red-500 py-3">
          ⚠️ Please login first.
        </td>
      </tr>`;
    return;
  }

  try {
    console.log("📡 Fetching points log for user:", user);
    const res = await fetch(`php/get_points_log.php?username=${encodeURIComponent(user)}`);
    if (!res.ok) throw new Error("Network error: " + res.status);

    const data = await res.json();
    console.log("✅ Points log response:", data);

    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-gray-400 py-3">
            No transactions yet.
          </td>
        </tr>`;
      return;
    }

    // Build rows with staggered animation
    tableBody.innerHTML = ""; // clear
    data.forEach((row, index) => {
      let color = "#D48905";
      let icon = "🟡";

      if (row.source === "game") {
        color = "#3B82F6";
        icon = "🎮";
      } else if (row.source === "spin") {
        color = "#22C55E";
        icon = "🎯";
      } else if (row.source === "login") {
        color = "#EAB308";
        icon = "✨";
      }

      const tr = document.createElement("tr");
      tr.className = "text-center border-t hover:bg-[#FFFBEA]/60 transition-all report-row";
      // stagger
      tr.style.animationDelay = `${(index * 60)}ms`;

      tr.innerHTML = `
        <td class="py-2 px-4">${row.created_at}</td>
        <td class="py-2 px-4 font-semibold text-[#4b3a00]">${icon} ${row.source}</td>
        <td class="py-2 px-4 font-bold" style="color:${color}">+${row.points}</td>
      `;

      tableBody.appendChild(tr);
    });
  } catch (err) {
    console.error("❌ Error loading report:", err);
    tableBody.innerHTML = `
      <tr>
        <td colspan="3" class="text-center text-red-500 py-3">
          ❌ Failed to load report data.
        </td>
      </tr>`;
  }
}

// Auto-load and re-load on updates
loadReports();
window.addEventListener("pointsUpdated", loadReports);
