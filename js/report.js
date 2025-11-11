// ✅ js/report.js — Final Multi-User Safe Version
export async function loadReports() {
  // 🕓 Wait until table is available in DOM
  await new Promise((resolve) => {
    const check = setInterval(() => {
      if (document.getElementById("pointsLogTable")) {
        clearInterval(check);
        resolve();
      }
    }, 100);
  });

  // 🧠 Restore user session from localStorage if needed
  if (!sessionStorage.getItem("steemhop_user") && localStorage.getItem("steemhop_user")) {
    sessionStorage.setItem("steemhop_user", localStorage.getItem("steemhop_user"));
  }

  const user = sessionStorage.getItem("steemhop_user");
  const tableBody = document.getElementById("pointsLogTable");

  if (!tableBody) {
    console.error("❌ Table body element (#pointsLogTable) not found even after wait.");
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

    // ⚙️ Handle empty log
    if (!Array.isArray(data) || data.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="3" class="text-center text-gray-400 py-3">
            No transactions yet.
          </td>
        </tr>`;
      return;
    }

    // 🧹 Clear table before populating
    tableBody.innerHTML = "";

    // 🧾 Render transaction rows
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
      tr.style.animationDelay = `${index * 60}ms`;

      tr.innerHTML = `
        <td class="py-2 px-4">${row.created_at}</td>
        <td class="py-2 px-4 font-semibold text-[#4b3a00]">${icon} ${row.source}</td>
        <td class="py-2 px-4 " style="color:${color}">+${row.points}</td>
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

// ✅ Load reports automatically after short delay (DOM ready)
setTimeout(loadReports, 400);

// ✅ Refresh reports when user or points update
window.addEventListener("pointsUpdated", loadReports);
window.addEventListener("userSessionChanged", loadReports);

// ✅ Optional: reload when tab becomes active again (helps multi-user dashboards)
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") loadReports();
});
