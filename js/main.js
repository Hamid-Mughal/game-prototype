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
  if (page === "leaderboard") import("./leaderboard.js");
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

        // ✅ Load dashboard and profile immediately
        await loadPage("dashboard", user);

        hideLoader();
      }, 1000);
    } else {
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
