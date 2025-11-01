const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const bottomNav = document.getElementById("bottom-nav");
const status = document.getElementById("status");
const pageContent = document.getElementById("page-content");
const loader = document.getElementById("loader-screen"); // ✅ loader element reference

// Load module dynamically
async function loadPage(page, user = null) {
  const res = await fetch(`modules/${page}.html`);
  const html = await res.text();
  pageContent.innerHTML = html;

  if (page === "dashboard") {
    const module = await import("./dashboard.js");
    if (user) module.loadUserProfile(user); // ✅ load profile instantly
  }
  if (page === "game") import("./game.js");
if (page === "leaderboard") {
  // Wait a moment to ensure the new HTML (leaderList) is injected
  setTimeout(async () => {
    const module = await import(`./leaderboard.js?update=${Date.now()}`);
    if (module && typeof module.loadLeaderboard === "function") {
      await module.loadLeaderboard();
    }
  }, 300);
}
if (page === "spinwheel") {
  const module = await import("./spinwheel.js");
  module.initSpinWheel();
}
// ✅ Fix for "Reports" page (file name: report.html)
if (page === "report") {
  try {
    // Wait a bit for HTML to be inserted
    await new Promise((r) => setTimeout(r, 300));

    const module = await import("./report.js");
    if (module && typeof module.loadReports === "function") {
      module.loadReports();
      console.log("✅ Reports module loaded successfully.");
    } else {
      console.error("⚠️ report.js loaded, but loadReports() not found.");
    }
  } catch (err) {
    console.error("❌ Failed to load report.js:", err);
  }
}


}

// ✅ Show loader
function showLoader() {
  loader.classList.remove("hidden");
  loader.classList.add("active");
}

// ✅ Hide loader
function hideLoader() {
  loader.classList.remove("active");
  setTimeout(() => loader.classList.add("hidden"), 400);
}

// ✅ Handle Login
document.getElementById("sign").onclick = () => {
  const user = document.getElementById("user").value.trim();
  if (!user) return alert("⚠️ Please enter your Steem username.");
  if (!window.steem_keychain) return alert("❌ Steem Keychain not detected.");

  status.textContent = "⏳ Logging in...";
  window.steem_keychain.requestSignBuffer(user, "hello_from_steem_hop", "Posting", async (r) => {
   if (r.success) {
  localStorage.setItem("steemhop_user", user);
  showLoader();

  setTimeout(async () => {
    loginScreen.classList.add("hidden");
    appScreen.classList.remove("hidden");
    bottomNav.classList.remove("hidden");

    // ✅ Award daily login points
    try {
      const form = new URLSearchParams();
      form.append("username", user);
      const rewardRes = await fetch("php/login_reward.php", {
        method: "POST",
        body: form
      });
      const rewardData = await rewardRes.json();

      if (rewardData.success) {
        alert(rewardData.message);
      } else {
        console.log(rewardData.message);
      }
    } catch (err) {
      console.warn("⚠️ Daily reward check failed:", err);
    }

    await loadPage("dashboard", user);
    hideLoader();
  }, 1000);
}
 else {
      status.textContent = "❌ Login failed: " + r.message;
    }
  });
};

// ✅ Auto-login on reload
window.addEventListener("load", async () => {
  const savedUser = localStorage.getItem("steemhop_user");
  if (savedUser) {
    showLoader();
    setTimeout(async () => {
      loginScreen.classList.add("hidden");
      appScreen.classList.remove("hidden");
      bottomNav.classList.remove("hidden");

      await loadPage("dashboard", savedUser);

      hideLoader();
    }, 800);
  }
});

// ✅ Logout (desktop + mobile)
["logout", "logout-mobile"].forEach(id => {
  const btn = document.getElementById(id);
  if (btn) {
    btn.addEventListener("click", () => {
      localStorage.removeItem("steemhop_user");
      appScreen.classList.add("hidden");
      loginScreen.classList.remove("hidden");
      bottomNav.classList.add("hidden");
    });
  }
});

// ✅ Sidebar + Bottom Navigation
document.querySelectorAll("[data-page]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const page = btn.dataset.page;
    const user = localStorage.getItem("steemhop_user");

    showLoader();
    await loadPage(page, user);
    setTimeout(hideLoader, 500);

    // Update active states
    document.querySelectorAll("[data-page]").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});
// sidebar toggler
const menuToggle = document.getElementById("menu-toggle");
      const sidebar = document.getElementById("sidebar");
      const overlay = document.getElementById("overlay");

      if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener("click", () => {
          sidebar.classList.toggle("-translate-x-full");
          overlay.classList.toggle("hidden");
        });

        overlay.addEventListener("click", () => {
          sidebar.classList.add("-translate-x-full");
          overlay.classList.add("hidden");
        });
      }