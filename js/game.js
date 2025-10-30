let player, cars, score, gameOver, gameInterval;
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startGame");
const scoreEl = document.getElementById("score");

function initGame() {
  player = { x: 180, y: 450, size: 20 };
  cars = [];
  score = 0;
  gameOver = false;
  for (let i = 0; i < 5; i++) {
    cars.push({ x: Math.random() * 360, y: i * -120, w: 40, h: 20, speed: 2 + Math.random() * 3 });
  }
}
function drawPlayer() { ctx.fillStyle = "yellow"; ctx.fillRect(player.x, player.y, player.size, player.size); }
function drawCars() {
  ctx.fillStyle = "red";
  cars.forEach(c => {
    ctx.fillRect(c.x, c.y, c.w, c.h);
    c.y += c.speed;
    if (c.y > 500) { c.y = -60; c.x = Math.random() * 360; score++; }
    if (player.x < c.x + c.w && player.x + player.size > c.x && player.y < c.y + c.h && player.y + player.size > c.y) endGame();
  });
}
function drawRoad() {
  ctx.fillStyle = "#444";
  ctx.fillRect(0, 0, 400, 500);
  ctx.strokeStyle = "#888";
  for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(0, i * 100); ctx.lineTo(400, i * 100); ctx.stroke(); }
}
function updateGame() {
  if (gameOver) return;
  ctx.clearRect(0, 0, 400, 500);
  drawRoad(); drawCars(); drawPlayer();
  scoreEl.textContent = "Score: " + score;
}
function endGame() {
  clearInterval(gameInterval);
  gameOver = true;
  alert("💀 Game Over! Your score: " + score);
  const username = localStorage.getItem("steemhop_user") || "Guest";
  fetch("php/save_score.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `username=${encodeURIComponent(username)}&score=${encodeURIComponent(score)}`
  });
}
startBtn.onclick = () => { clearInterval(gameInterval); initGame(); gameInterval = setInterval(updateGame, 40); };
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && player.x > 0) player.x -= 20;
  if (e.key === "ArrowRight" && player.x < 380) player.x += 20;
  if (e.key === "ArrowUp" && player.y > 0) player.y -= 20;
  if (e.key === "ArrowDown" && player.y < 480) player.y += 20;
});
