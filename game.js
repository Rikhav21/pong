const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PDW = 10;
const PDH = 100;
const BLLR = 30;
const PDDLSP = 7;
const BLLSP = 2;
const GRAV = 0.2;
const SLRFLR = 10000; 
let BLLX = WIDTH / 2;
let BLLY = HEIGHT / 2;
let BLLDX = BLLSP * (Math.random() > 0.5 ? 1 : -1);
let ballDY = BLLSP * (Math.random() > 0.5 ? 1 : -1);
let LPDDY = (HEIGHT - PDH) / 2;
let RPDDY = (HEIGHT - PDH) / 2;
let LFTS = 0;
let RGHS = 0;
let LPDDM = 0;
let RPDDM = 0;
let GRVANG = Math.random() * 360; 
let SLRFLRACT = false;
let SLRFLRTME = Date.now();
let GMEM = "menu"; 
const stars = Array.from({ length: 100 }, () => ({
  x: Math.random() * WIDTH,
  y: Math.random() * HEIGHT,
}));
const RCKIMG = new Image();
RCKIMG.src = "rocket.png";
document.addEventListener("keydown", (e) => {
  if (e.key === "w") LPDDM = -PDDLSP;
  if (e.key === "s") LPDDM = PDDLSP;
  if (e.key === "ArrowUp") RPDDM = -PDDLSP;
  if (e.key === "ArrowDown") RPDDM = PDDLSP;

  if (GMEM === "menu") {
    if (e.key === "1") GMEM = "pvp";
    if (e.key === "2") GMEM = "ai";
  }
});

document.addEventListener("keyup", (e) => {
  if (e.key === "w" || e.key === "s") LPDDM = 0;
  if (e.key === "ArrowUp" || e.key === "ArrowDown") RPDDM = 0;
});
function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width, height);
}

function drawText(text, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial`;
  ctx.fillText(text, x, y);
}

function drawRocket(x, y, angle) {
  const size = BLLR * 2;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.drawImage(RCKIMG, -size / 2, -size / 2, size, size);
  ctx.restore();
}
function drawStars() {
  ctx.fillStyle = "yellow";
  for (const star of stars) {
    ctx.beginPath();
    ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}
function updateGame() {
  if (GMEM === "menu") return;
  LPDDY += LPDDM;
  RPDDY += RPDDM;
  LPDDY = Math.max(0, Math.min(HEIGHT - PDH, LPDDY));
  RPDDY = Math.max(0, Math.min(HEIGHT - PDH, RPDDY));
  BLLX += BLLDX;
  BLLY += ballDY;
  const GRAVX = GRAV * Math.cos((GRVANG * Math.PI) / 180);
  const GRAVY = GRAV * Math.sin((GRVANG * Math.PI) / 180);
  BLLDX += GRAVX;
  ballDY += GRAVY;
  if (BLLX > WIDTH / 2 && BLLDX < 0 || BLLX < WIDTH / 2 && BLLDX > 0) {
    GRVANG = (540 - GRVANG) % 360; 
  }
  if (BLLY - BLLR <= 0 || BLLY + BLLR >= HEIGHT) {
    ballDY *= -1;
  }
  if (
    BLLX - BLLR <= 20 &&
    BLLY >= LPDDY &&
    BLLY <= LPDDY + PDH
  ) {
    BLLDX *= -1;
  }
  if (
    BLLX + BLLR >= WIDTH - 20 &&
    BLLY >= RPDDY &&
    BLLY <= RPDDY + PDH
  ) {
    BLLDX *= -1;
  }
  if (BLLX < 0) {
    RGHS++;
    resetBall();
  } else if (BLLX > WIDTH) {
    LFTS++;
    resetBall();
  }
  if (Date.now() - SLRFLRTME > SLRFLR) {
    GRVANG = Math.random() * 360;
    SLRFLRACT = true;
    SLRFLRTME = Date.now();
  }

  if (GMEM === "ai") {
    if (BLLY < RPDDY + PDH / 2) {
      RPDDM = -PDDLSP;
    } else if (BLLY > RPDDY + PDH / 2) {
      RPDDM = PDDLSP;
    } else {
      RPDDM = 0;
    }
  }
}
function resetBall() {
  BLLX = WIDTH / 2;
  BLLY = HEIGHT / 2;
  BLLDX = BLLSP * (Math.random() > 0.5 ? 1 : -1);
  ballDY = BLLSP * (Math.random() > 0.5 ? 1 : -1);
}
function drawGame() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  if (GMEM === "menu") {
    drawText("Space Pong", WIDTH / 2 - 100, HEIGHT / 3, 40, "white");
    drawText("1. Player vs Player", WIDTH / 3, HEIGHT / 2, 20, "white");
    drawText("2. Player vs AI", WIDTH / 3, HEIGHT / 2 + 30, 20, "white");
    return;
  }
  drawStars();
  drawRect(10, LPDDY, PDW, PDH, "white");
  drawRect(WIDTH - 20, RPDDY, PDW, PDH, "white");
  drawRocket(BLLX, BLLY, GRVANG);
  drawText(LFTS, WIDTH / 4, 50, 30, "white");
  drawText(RGHS, (WIDTH * 3) / 4, 50, 30, "white");
  if (SLRFLRACT) {
    drawText(
      "SOLAR FLARE!",
      WIDTH / 2 - 80,
      HEIGHT / 2,
      30,
      "yellow"
    );
    SLRFLRACT = false;
  }
}
function gameLoop() {
  updateGame();
  drawGame();
  requestAnimationFrame(gameLoop);
}
gameLoop();