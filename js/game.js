let player, cars, score, gameOver, gameInterval;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startGame");
const scoreEl = document.getElementById("score");

// ===============================
// 🎮 GAME INITIALIZATION
// ===============================
function initGame() {
  player = { x: 180, y: 450, size: 20 };
  cars = [];
  score = 0;
  gameOver = false;

  for (let i = 0; i < 5; i++) {
    cars.push({
      x: Math.random() * 360,
      y: i * -120,
      w: 40,
      h: 20,
      speed: 2 + Math.random() * 3,
    });
  }
}

// ===============================
// 🟨 DRAW FUNCTIONS
// ===============================
function drawPlayer() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawCars() {
  ctx.fillStyle = "red";
  cars.forEach((c) => {
    ctx.fillRect(c.x, c.y, c.w, c.h);
    c.y += c.speed;

    if (c.y > 500) {
      c.y = -60;
      c.x = Math.random() * 360;
      score++;
    }

    // 🚗 Collision detection
    if (
      player.x < c.x + c.w &&
      player.x + player.size > c.x &&
      player.y < c.y + c.h &&
      player.y + player.size > c.y
    ) {
      endGame();
    }
  });
}

function drawRoad() {
  ctx.fillStyle = "#444";
  ctx.fillRect(0, 0, 400, 500);
  ctx.strokeStyle = "#888";
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(0, i * 100);
    ctx.lineTo(400, i * 100);
    ctx.stroke();
  }
}

// ===============================
// 🧠 GAME LOOP
// ===============================
function updateGame() {
  if (gameOver) return;

  ctx.clearRect(0, 0, 400, 500);
  drawRoad();
  drawCars();
  drawPlayer();

  scoreEl.textContent = "Score: " + score;
}

// ===============================
// 💀 GAME OVER HANDLER
// ===============================
function endGame() {
  clearInterval(gameInterval);
  gameOver = true;

  const username = localStorage.getItem("steemhop_user") || "Guest";

  // Save score
  fetch("php/save_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${encodeURIComponent(username)}&score=${encodeURIComponent(score)}`,
  });

  // 🎉 Show modern popup
  showGamePopup(`💀 Game Over!<br>Your score: <strong>${score}</strong>`);
}

// ===============================
// 🌟 ANIMATED POPUP
// ===============================
function showGamePopup(message) {
  // Remove existing popup (if any)
  const oldPopup = document.querySelector(".game-popup");
  if (oldPopup) oldPopup.remove();

  const popup = document.createElement("div");
  popup.className = "game-popup show";
  popup.innerHTML = `
    <div class="game-popup-content animate-popup">
      <div class="popup-header">🎮 Steem Hop</div>
      <p class="popup-message">${message}</p>
      <div class="popup-buttons">
        <button id="retryBtn" class="retry-btn">🔁 </button>
        <button id="backBtn" class="back-btn"><i class="fa-solid fa-house"></i></button>
      </div>
    </div>
  `;
  document.body.appendChild(popup);

  // 🎯 Button actions
  document.getElementById("retryBtn").onclick = () => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
    startBtn.click();
  };

document.getElementById("backBtn").onclick = () => {
  popup.classList.remove("show");
  setTimeout(() => {
    popup.remove();

    const user = localStorage.getItem("steemhop_user");
    if (typeof window.loadPage === "function") {
      window.loadPage("dashboard", user);
    } else {
      console.error("❌ loadPage not found in global scope.");
    }
  }, 300);
};


}

// ===============================
// 🎯 EVENT LISTENERS
// ===============================
startBtn.onclick = () => {
  clearInterval(gameInterval);
  initGame();
  gameInterval = setInterval(updateGame, 40);
};

document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
  if (e.key === "ArrowRight" && player.x < 380) player.x += 20;
  if (e.key === "ArrowUp" && player.y > 0) player.y -= 20;
  if (e.key === "ArrowDown" && player.y < 480) player.y += 20;
});
