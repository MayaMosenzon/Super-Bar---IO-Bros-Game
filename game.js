const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");
const startScreen = document.getElementById("startScreen");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

const santaImg = new Image();
santaImg.src = "images/santa.png";

const bottleImg = new Image();
bottleImg.src = "images/bottle.png";

const bombImg = new Image();
bombImg.src = "images/bomb.png";

const backgroundImg = new Image();
backgroundImg.src = "images/background.png";

const santa = {
  x: 180,
  y: 0,
  width: 80,
  height: 80,
  speed: 10
};

let bottles = [];
let bombs = [];
let score = 0;
let difficultyLevel = 1;
let gameOver = false;
let isPaused = false;
let touchLeft = false;
let touchRight = false;

// שליטה במקלדת
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft") santa.x -= santa.speed;
  if (e.key === "ArrowRight") santa.x += santa.speed;
});

// שליטה בטאצ'
document.getElementById("leftTouch").addEventListener("touchstart", () => touchLeft = true);
document.getElementById("leftTouch").addEventListener("touchend", () => touchLeft = false);
document.getElementById("rightTouch").addEventListener("touchstart", () => touchRight = true);
document.getElementById("rightTouch").addEventListener("touchend", () => touchRight = false);

// שינוי גודל למסך
function resizeCanvasToFullScreen() {
  const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  canvas.width = window.innerWidth;
  canvas.height = height;
  santa.y = canvas.height - santa.height - 60;
}

window.addEventListener("resize", resizeCanvasToFullScreen);
document.addEventListener("fullscreenchange", resizeCanvasToFullScreen);

// בדיקת התנגשויות
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// יצירת בקבוק
function dropBottle() {
  const x = Math.random() * (canvas.width - 40);
  const speed = 2 + difficultyLevel * 0.5;
  bottles.push({ x, y: 0, width: 40, height: 80, speed });
}

// יצירת פצצה
function dropBomb() {
  const x = Math.random() * (canvas.width - 40);
  const speed = 2 + difficultyLevel * 0.5;
  bombs.push({ x, y: 0, width: 40, height: 80, speed });
}

// ציור ניקוד רטרו
function drawScore() {
  ctx.font = "bold 26px 'Press Start 2P', monospace";
  ctx.fillStyle = "#fff200";
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 3;
  ctx.strokeText("SCORE: " + score, 20, 40);
  ctx.fillText("SCORE: " + score, 20, 40);
}

// ציור המשחק
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(santaImg, santa.x, santa.y, santa.width, santa.height);

  bottles.forEach((bottle, i) => {
    bottle.y += bottle.speed;
    ctx.drawImage(bottleImg, bottle.x, bottle.y, bottle.width, bottle.height);
    if (isColliding(santa, bottle)) {
      score++;
      bottles.splice(i, 1);
    } else if (bottle.y > canvas.height) {
      bottles.splice(i, 1);
    }
  });

  bombs.forEach((bomb, i) => {
    bomb.y += bomb.speed;
    ctx.drawImage(bombImg, bomb.x, bomb.y, bomb.width, bomb.height);
    if (isColliding(santa, bomb)) {
      gameOver = true;
    } else if (bomb.y > canvas.height) {
      bombs.splice(i, 1);
    }
  });

  drawScore();
  if (score > 0 && score % 19 === 0) {
  ctx.font = "bold 16px 'Press Start 2P'";
  ctx.fillStyle = "#00ff00";
  ctx.textAlign = "center";
  ctx.fillText("🍃 TOO MUCH FERNET! 🍃", canvas.width / 2, 80);
}

  if (gameOver) {
    ctx.font = "bold 42px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 5;
    ctx.fillStyle = "#ff4444";
    ctx.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2);
    ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
    restartBtn.style.display = "block";
    restartBtn.classList.add("show-pop");
  }

  if (touchLeft) {
    santa.x -= santa.speed;
    if (santa.x < 0) santa.x = 0;
  }
  if (touchRight) {
    santa.x += santa.speed;
    if (santa.x + santa.width > canvas.width) {
      santa.x = canvas.width - santa.width;
    }
  }
}

// לולאת המשחק
function gameLoop() {
  if (!isPaused && !gameOver) {
    draw();
    requestAnimationFrame(gameLoop);
  }
}

// איפוס המשחק
function resetGame() {
  bottles = [];
  bombs = [];
  score = 0;
  difficultyLevel = 1;
  santa.x = 180;
  santa.speed = 5;
  gameOver = false;
  restartBtn.style.display = "none";
  restartBtn.classList.remove("show-pop");
  resizeCanvasToFullScreen();
  gameLoop();
}

// התחלת המשחק
function startGame() {
  startScreen.style.display = "none";
  resizeCanvasToFullScreen();
  canvas.focus();
  gameLoop();
}

// לחיצה על כפתור התחל / שחק שוב
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetGame);

// לחיצה על כפתור עצור
pauseBtn.addEventListener("click", () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "▶ RESUME" : "⏸ PAUSE";
  if (!isPaused && !gameOver) {
    requestAnimationFrame(gameLoop);
  }
});

// בקבוקים ופצצות כל כמה שניות
setInterval(dropBottle, 1500);
setInterval(dropBomb, 5000);
setInterval(() => {
  difficultyLevel += 0.2;
  santa.speed += 0.2;
}, 5000);

// טוען את פונט הרטרו
const font = document.createElement('link');
font.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
font.rel = 'stylesheet';
document.head.appendChild(font);
