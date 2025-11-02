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

  // Run confetti
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

  // Stop confetti after 4 seconds
  setTimeout(() => {
    canvas.remove();
  }, 4000);
}

// ✅ Dynamic Page Loader
async function loadPage(page, user = null) {
  window.loadPage = loadPage;
  const res = await fetch(`modules/${page}.html`);
  const html = await res.text();
  pageContent.innerHTML = html;

  if (page === "dashboard") {
    const module = await import("./dashboard.js");
    if (user) module.loadUserProfile(user);
  }

  if (page === "game") {
    const module = await import(`./game.js?update=${Date.now()}`);
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

// ✅ Show/Hide Loader
function showLoader() {
  loader.classList.remove("hidden");
  loader.classList.add("active");
}
function hideLoader() {
  loader.classList.remove("active");
  setTimeout(() => loader.classList.add("hidden"), 400);
}

// ✅ Login Logic
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

// ✅ Logout
["logout", "logout-mobile"].forEach((id) => {
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

// ✅ Sidebar Navigation
// ✅ Sidebar + Bottom Navigation (Improved)
document.querySelectorAll("[data-page]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const page = btn.dataset.page;
    const user = localStorage.getItem("steemhop_user");

    showLoader();
    await loadPage(page, user);
    setTimeout(hideLoader, 500);

    // Update active states
    document.querySelectorAll("[data-page]").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    // ✅ AUTO-CLOSE SIDEBAR ON MOBILE
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("overlay");

    // If we're on mobile (sidebar is toggleable)
    if (window.innerWidth < 640 && sidebar && overlay) {
      sidebar.classList.add("-translate-x-full");
      overlay.classList.add("hidden");
    }
  });
});

// ✅ Sidebar Toggler 
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

// ✅ Auto Logout after 2 hours inactivity
let inactivityTimer;
const AUTO_LOGOUT_TIME = 2 * 60 * 60 * 1000;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(autoLogout, AUTO_LOGOUT_TIME);
}
function autoLogout() {
  const user = localStorage.getItem("steemhop_user");
  if (user) {
    showRewardPopup("⚠️ Auto Logout", "⏳ You were logged out due to inactivity.");
    localStorage.removeItem("steemhop_user");
    appScreen.classList.add("hidden");
    loginScreen.classList.remove("hidden");
    bottomNav.classList.add("hidden");
  }
}
["mousemove", "mousedown", "keydown", "touchstart", "scroll"].forEach((evt) => {
  window.addEventListener(evt, resetInactivityTimer);
});
window.addEventListener("load", () => {
  const savedUser = localStorage.getItem("steemhop_user");
  if (savedUser) resetInactivityTimer();
});

// ✅ Global Navigation
window.navigateTo = async function (pageName) {
  const user = localStorage.getItem("steemhop_user");
  if (!user) return;
  showLoader();
  await loadPage(pageName, user);
  setTimeout(hideLoader, 500);
  document.querySelectorAll("[data-page]").forEach((b) => b.classList.remove("active"));
  const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
  if (activeBtn) activeBtn.classList.add("active");
};
