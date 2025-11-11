
const loginScreen = document.getElementById("login-screen");
const appScreen = document.getElementById("app-screen");
const bottomNav = document.getElementById("bottom-nav");
const status = document.getElementById("status");
const pageContent = document.getElementById("page-content");
const loader = document.getElementById("loader-screen");

// 🎉 Confetti + Reward Popup
function showRewardPopup(title, message) {
  const popup = document.createElement("div");
  popup.className = "reward-popup show";
  popup.innerHTML = `
    <div class="reward-popup-content">
      <canvas id="confettiCanvas"></canvas>
      <h2>${title}</h2>
      <p>${message}</p>
      <button id="popup-ok">OK</button>
    </div>
  `;
  document.body.appendChild(popup);

  startConfetti("confettiCanvas");

  document.getElementById("popup-ok").onclick = () => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  };
}

// ✨ Simple Confetti Animation
function startConfetti(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const particles = [];
  const colors = ["#FFD700", "#EAB308", "#D48905", "#FF8C00", "#FFB700"];
  const w = (canvas.width = window.innerWidth);
  const h = (canvas.height = window.innerHeight);
  const maxParticles = 100;

  for (let i = 0; i < maxParticles; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h - h,
      r: Math.random() * 6 + 2,
      d: Math.random() * maxParticles,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < maxParticles; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
      ctx.stroke();
    }
    update();
  }

  function update() {
    for (let i = 0; i < maxParticles; i++) {
      const p = particles[i];
      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 1 + p.r / 2) / 2;
      p.x += Math.sin(0.5);
      p.tilt = Math.sin(p.tiltAngle - i / 3) * 15;

      if (p.y > h) {
        particles[i] = {
          x: Math.random() * w,
          y: -10,
          r: p.r,
          d: p.d,
          color: p.color,
          tilt: p.tilt,
          tiltAngleIncremental: p.tiltAngleIncremental,
          tiltAngle: p.tiltAngle,
        };
      }
    }
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  loop();

  setTimeout(() => {
    canvas.remove();
  }, 4000);
}

// ✅ Dynamic Page Loader
async function loadPage(page, user = null) {
  window.loadPage = loadPage;

  // 🔧 FIXED PATH (relative)
  const res = await fetch(`./modules/${page}.html?update=${Date.now()}`);
  const html = await res.text();
  pageContent.innerHTML = html;

  if (page === "dashboard") {
    const module = await import(`./dashboard.js?update=${Date.now()}`);
    if (user) module.loadUserProfile(user);
  }

  if (page === "game") {
    console.log("🎮 Loading embedded HTML5 game...");
    // No import needed — iframe handles the HTML5 game
  }

  if (page === "leaderboard") {
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

  if (page === "report") {
    try {
      await new Promise((r) => setTimeout(r, 300));
      const module = await import("./report.js");
      if (module && typeof module.loadReports === "function") {
        module.loadReports();
      }
    } catch (err) {
      console.error("❌ Failed to load report.js:", err);
    }
  }
}

// ✅ Loader Handling
function showLoader() {
  loader.classList.remove("hidden");
  loader.classList.add("active");
}
function hideLoader() {
  loader.classList.remove("active");
  setTimeout(() => loader.classList.add("hidden"), 400);
}

// ✅ Session Timeout
const SESSION_TIMEOUT = 2 * 60 * 60 * 1000;
const LAST_CLOSE_KEY = "steemhop_last_close_time";

// ✅ Start Session
function startSession(username) {
  sessionStorage.clear();
  sessionStorage.setItem("steemhop_user", username);
  localStorage.setItem("steemhop_user", username);
  localStorage.setItem(LAST_CLOSE_KEY, Date.now().toString());
}

// ✅ Login Logic
document.getElementById("sign").onclick = () => {
  const user = document.getElementById("user").value.trim();
  if (!user) return alert("⚠️ Please enter your Steem username.");
  if (!window.steem_keychain) return alert("❌ Steem Keychain not detected.");

  status.textContent = "⏳ Logging in...";
  window.steem_keychain.requestSignBuffer(
    user,
    "hello_from_steem_hop",
    "Posting",
    async (r) => {
      if (r.success) {
        startSession(user);
        showLoader();

        setTimeout(async () => {
          loginScreen.classList.add("hidden");
          appScreen.classList.remove("hidden");
          bottomNav.classList.remove("hidden");

          try {
            const form = new URLSearchParams();
            form.append("username", user);
            const rewardRes = await fetch("php/login_reward.php", {
              method: "POST",
              body: form,
            });
            const rewardData = await rewardRes.json();

            if (rewardData.success) {
              showRewardPopup("🎉 Daily Reward", rewardData.message);
              const userPointsEl = document.getElementById("userPoints");
              if (userPointsEl && rewardData.total_points !== undefined) {
                userPointsEl.textContent = rewardData.total_points;
              }
              window.dispatchEvent(new Event("pointsUpdated"));
            }
          } catch (err) {
            console.warn("⚠️ Daily reward check failed:", err);
          }

          await loadPage("dashboard", user);
          hideLoader();
        }, 1000);
      } else {
        status.textContent = "❌ Login failed: " + r.message;
      }
    }
  );
};

// ✅ Session Restore
window.addEventListener("load", async () => {
  let savedUser = sessionStorage.getItem("steemhop_user");
  if (!savedUser && localStorage.getItem("steemhop_user")) {
    savedUser = localStorage.getItem("steemhop_user");
    sessionStorage.setItem("steemhop_user", savedUser);
  }

  const lastClose = parseInt(localStorage.getItem(LAST_CLOSE_KEY), 10);
  const now = Date.now();

  if (savedUser && lastClose) {
    if (now - lastClose > SESSION_TIMEOUT) {
      sessionStorage.clear();
      localStorage.removeItem("steemhop_user");
      localStorage.removeItem(LAST_CLOSE_KEY);
      appScreen.classList.add("hidden");
      loginScreen.classList.remove("hidden");
      bottomNav.classList.add("hidden");
    } else {
      showLoader();
      setTimeout(async () => {
        loginScreen.classList.add("hidden");
        appScreen.classList.remove("hidden");
        bottomNav.classList.remove("hidden");
        await loadPage("dashboard", savedUser);
        hideLoader();
        window.dispatchEvent(new Event("userSessionChanged"));
      }, 800);
    }
  }
});

// ✅ Logout
function logoutUser(
  title = "👋 Logged Out",
  message = "You have been logged out."
) {
  sessionStorage.clear();
  localStorage.removeItem("steemhop_user");
  localStorage.removeItem(LAST_CLOSE_KEY);
  appScreen.classList.add("hidden");
  loginScreen.classList.remove("hidden");
  bottomNav.classList.add("hidden");
  showRewardPopup(title, message);
}

["logout", "logout-mobile"].forEach((id) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", () => logoutUser());
});

// ✅ Sidebar Navigation
document.querySelectorAll("[data-page]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const page = btn.dataset.page;
    const user = sessionStorage.getItem("steemhop_user");
    if (!user) return logoutUser("⚠️ Login Required", "Please log in again.");

    showLoader();
    await loadPage(page, user);
    setTimeout(hideLoader, 500);

    document
      .querySelectorAll("[data-page]")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");
    if (window.innerWidth < 640 && sidebar && overlay) {
      sidebar.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    }
  });
});

// ✅ Sidebar Toggle
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

// ✅ Global Navigation
window.navigateTo = async function (pageName) {
  const user = sessionStorage.getItem("steemhop_user");
  if (!user) return logoutUser("⚠️ Login Required", "Please log in again.");
  showLoader();
  await loadPage(pageName, user);
  setTimeout(hideLoader, 500);
  document
    .querySelectorAll("[data-page]")
    .forEach((b) => b.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
  if (activeBtn) activeBtn.classList.add("active");
};
// ✅ Fullscreen Logic for Game Page with ESC → Dashboard
async function enableGameFullscreen() {
  const iframe = document.getElementById("steemhopGameFrame");
  if (!iframe) return;

  // 🔹 Automatically enter fullscreen after short delay
  setTimeout(() => {
    try {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen();
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen(); // Safari
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen(); // IE11
      }
    } catch (err) {}
  }, 800);

  // 🔹 Exit fullscreen and return to dashboard on ESC
  document.addEventListener("keydown", async (e) => {
    if (e.key === "Escape") {
      if (document.fullscreenElement) {
        await document.exitFullscreen();

        window.navigateTo("dashboard");
      } else {
        window.navigateTo("dashboard");
      }
    }
  });

  // 🔹 Handle manual fullscreen exit (like mobile swipe)
  document.addEventListener("fullscreenchange", async () => {
    if (!document.fullscreenElement) {
      window.navigateTo("dashboard");
    }
  });
}

// ✅ Extend loadPage() to trigger fullscreen only on game page
const originalLoadPage = loadPage;
window.loadPage = async function (page, user = null) {
  await originalLoadPage(page, user);

  if (page === "game") {
    enableGameFullscreen();
  }
};

