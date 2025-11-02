// js/spinwheel.js
export async function initSpinWheel() {
  await new Promise((r) => setTimeout(r, 200));

  const canvas = document.getElementById("spinWheelCanvas");
  const ctx = canvas?.getContext("2d");
  const spinButton = document.getElementById("spinButton");
  const result = document.getElementById("spinResult");

  if (!canvas || !ctx) {
    console.error("❌ Spin wheel canvas not found — retrying...");
    setTimeout(initSpinWheel, 300);
    return;
  }

  console.log("✅ Spin wheel initialized properly.");

  const prizes = ["Try Again", "0 Points", "5 Points", "10 Points", "15 Points"];
  const colors = ["#FFD700", "#FFB700", "#EAB515", "#F9C80E", "#FF8C00"];

  let isSpinning = false;
  let angle = 0;

  function resizeCanvas() {
    const parentWidth = canvas.parentElement.offsetWidth;
    const size = Math.min(parentWidth * 0.8, 320);
    canvas.width = size;
    canvas.height = size;
    drawWheel();
  }
  window.addEventListener("resize", resizeCanvas);

  function drawWheel(rotation = 0) {
    const sliceAngle = (2 * Math.PI) / prizes.length;
    const radius = canvas.width / 2.3;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation);

    prizes.forEach((label, i) => {
      const start = i * sliceAngle;
      const end = start + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();

      ctx.save();
      ctx.rotate(start + sliceAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#4b3a00";
      ctx.font = `${canvas.width / 20}px Fredoka One`;
      ctx.fillText(label, radius - 10, 5);
      ctx.restore();
    });

    ctx.beginPath();
    ctx.arc(0, 0, canvas.width / 8, 0, 2 * Math.PI);
    ctx.fillStyle = "#FFFBEA";
    ctx.fill();
    ctx.strokeStyle = "#D48905";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();
  }

  function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;
    result.textContent = "";

    const randomSpin = Math.random() * 360 + 1800;
    const startAngle = angle;
    const endAngle = startAngle + randomSpin;
    const duration = 4000;
    const startTime = Date.now();

    function animate() {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentAngle = startAngle + easeOut * randomSpin;

      drawWheel((currentAngle * Math.PI) / 180);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        angle = endAngle % 360;
        isSpinning = false;
        showResult();
      }
    }

    animate();
  }

  async function showResult() {
    const slice = 360 / prizes.length;
    let adjustedAngle = (angle + 90) % 360;
    if (adjustedAngle < 0) adjustedAngle += 360;

    const index = Math.floor((360 - adjustedAngle) / slice) % prizes.length;
    const prize = prizes[index];
    result.textContent = `🎉 You got: ${prize}!`;

    const username = localStorage.getItem("steemhop_user");
    if (!username) return showPopup("⚠️ Please login first.", "warning");

    let score = 0;
    if (prize.includes("Points")) score = parseInt(prize);
    else score = 0;

    await saveSpinResult(username, score);
  }

  async function saveSpinResult(username, score) {
    try {
      const res = await fetch("php/save_spin.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `username=${encodeURIComponent(username)}&score=${encodeURIComponent(score)}`,
      });

      const data = await res.json();
      console.log("✅ Spin result response:", data);

      if (!data.success) {
        showPopup(data.message || "❌ Spin save failed.", "error");
        return;
      }

      const message =
        score > 0
          ? `🎯 You won <strong>+${score}</strong> points!<br>Total: ${data.total_points}`
          : `😅 Try again next time!`;

      showPopup(message, score > 0 ? "success" : "warning", score);

      window.dispatchEvent(new CustomEvent("pointsUpdated"));
      window.dispatchEvent(new CustomEvent("leaderboardUpdated"));
    } catch (err) {
      console.error("❌ Error saving spin:", err);
      showPopup("⚠️ Network error. Try again later.", "error");
    }
  }

  drawWheel();
  resizeCanvas();
  spinButton.addEventListener("click", spinWheel);
}

/* === Animated Reward Popup === */
function showPopup(message, type = "success", points = 0) {
  const popup = document.createElement("div");
  popup.className = `reward-popup ${type}`;
  popup.innerHTML = `
    <div class="reward-popup-content">
      ${points >= 10 ? "<h3>💥 Big Win!</h3>" : ""}
      <p>${message}</p>
      <button class="popup-btn">OK</button>
      <div class="confetti"></div>
    </div>
  `;

  document.body.appendChild(popup);
  setTimeout(() => popup.classList.add("show"), 50);

  const btn = popup.querySelector(".popup-btn");
  btn.addEventListener("click", () => closePopup(popup));

  // Auto close after 4s
  setTimeout(() => closePopup(popup), 4000);
}

function closePopup(popup) {
  popup.classList.remove("show");
  setTimeout(() => popup.remove(), 600);
}
