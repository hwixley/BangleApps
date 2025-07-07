
// ==== SCREEN VARIABLES ====
const SCREEN_WIDTH = 176;
const SCREEN_HEIGHT = 176;

let cx = SCREEN_WIDTH / 2,
  cy = SCREEN_HEIGHT / 2;

  // --- CONSTANTS ---
const TILE = 16;
const MAP = [
  [1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,1],
  [1,0,1,1,1,0,0,1],
  [1,0,1,0,1,0,0,1],
  [1,0,1,0,1,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1],
];
const FOV = Math.PI / 4;
const MAX_HEALTH = 10;

// --- GLOBALS ---
let player, zombies, game;
let renderInterval;
let touchHandlers = [];
let frameCount = 0;

// --- COMPILED HELPERS ---
function dist(x1, x2, y1, y2) {
  "compiled";
  var dx = x1 - x2;
  var dy = y1 - y2;
  return Math.sqrt(dx * dx + dy * dy);
}

function castRayDist(px, py, cos, sin) {
  "compiled";
  var x = px;
  var y = py;
  var tx, ty;
  while (1) {
    x += cos;
    y += sin;
    tx = x >> 4; // divide by TILE=16 fast with bitshift
    ty = y >> 4;
    if (MAP[ty] && MAP[ty][tx] === 1) break;
  }
  var dx = x - px;
  var dy = y - py;
  return Math.sqrt(dx * dx + dy * dy);
}

// --- Optimized moveZombies compiled and throttled to every 3 frames ---
function moveZombiesCompiled() {
  "compiled";
  for (var i=0;i<zombies.length;i++) {
    var z = zombies[i];
    var dx = player.x - z.x, dy = player.y - z.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 0.5) {
      dx /= distance; dy /= distance;
      var rand = 0.5 + Math.random()*0.5; // simplified randomness for speed variation
      z.x += dx * z.speed * rand;
      z.y += dy * z.speed * rand;
    }
  }
}

// --- GAME FUNCTIONS ---
function resetPlayer() {
  player.x = 2 * TILE;
  player.y = 2 * TILE;
  player.angle = 0;
  player.health = MAX_HEALTH;
  player.kills = 0;
  player.lastHit = 0;
}

function spawnZombies(n) {
  zombies = [];
  for (let i = 0; i < n; i++) {
    let zx = (MAP[0].length - 1 - Math.floor(Math.random() * 3)) * TILE;
    let zy = (MAP.length - 1 - Math.floor(Math.random() * 3)) * TILE;
    zombies.push({ x: zx, y: zy, health: 5, speed: 0.3 });
  }
}

function moveZombies() {
  moveZombiesCompiled();

  let now = getTime() * 1000;
  for (let i = 0; i < zombies.length; i++) {
    let z = zombies[i];
    let dx = player.x - z.x, dy = player.y - z.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance <= 0.5 && now - player.lastHit > 500) {
      player.health--;
      player.lastHit = now;
      g.setBgColor("#f00").setColor(0).clear();
    }
  }
}

function movePlayer(backward) {
  let dir = backward ? -1 : 1;
  let nx = player.x + Math.cos(player.angle) * TILE / 4 * dir;
  let ny = player.y + Math.sin(player.angle) * TILE / 4 * dir;
  let tx = nx >> 4, ty = ny >> 4;
  if (MAP[ty][tx] === 0) {
    player.x = nx; player.y = ny;
    game.needsRender = true;
  }
}

function zombieScreenData(z) {
  let dx = z.x - player.x, dy = z.y - player.y;
  let ang = Math.atan2(dy, dx);
  let diff = ((player.angle - ang + Math.PI) % (2 * Math.PI)) - Math.PI;
  if (Math.abs(diff) > FOV / 2) return null;
  let d = dist(z.x, player.x, z.y, player.y);
  if (d < TILE) d = TILE;
  let h = Math.min(SCREEN_HEIGHT, TILE * 0.9 * SCREEN_HEIGHT / d);
  let w = h / 3;
  let sx = cx + Math.tan(-diff) * cx;
  let sy = cy + 400 / d;
  return { x: sx, y: sy, w: w, h: h };
}

function renderZombies() {
  for (let i = 0; i < zombies.length; i++) {
    let z = zombies[i];
    let s = zombieScreenData(z);
    if (!s) continue;
    let alive = z.health > 0;
    if (alive) {
      g.setColor(0, 1, 0);
    } else {
      g.setColor(1, 0, 0);
    }
    g.fillCircle(s.x, s.y - s.h / 2 - 20, 10);
    g.setColor(1, 1, 1);
    g.drawString(z.health, s.x, s.y - s.h / 2 - 30);
    if (alive) {
      g.setColor(0.12, 0.56, 0);
    } else {
      g.setColor(1, 0, 0);
    }
    g.fillRect(s.x - s.w / 2, s.y - s.h / 2, s.x + s.w / 2, s.y + s.h / 2);
  }
}

function renderHUD() {
  g.setColor(1, 0, 0).fillRect(40, SCREEN_HEIGHT - 40, SCREEN_WIDTH - 40, SCREEN_HEIGHT - 20);
  g.setColor(0, 1, 0).fillRect(40, SCREEN_HEIGHT - 40, 40 + (SCREEN_WIDTH - 80) * (player.health / MAX_HEALTH), SCREEN_HEIGHT - 20);
  g.setFont("Vector", 10).drawString("Zombies:", 20, 20);
  g.setFont("Vector", 20).drawString(zombies.length, 20, 30);
  g.setFont("Vector", 10).drawString("Level " + game.level, cx - 10, 20);
  g.drawString("Kills:", SCREEN_WIDTH - 40, 20);
  g.setFont("Vector", 20).drawString(player.kills, SCREEN_WIDTH - 40, 30);
}

function renderScene() {
  if (!game.needsRender) return;
  game.needsRender = false;
  // game.lastRender = getTime() * 1000;

  g.clear();
  g.setColor(0, 0, 0).fillRect(0, 0, SCREEN_WIDTH, cy);
  g.setColor(0.5, 0.25, 0).fillRect(0, cy, SCREEN_WIDTH, SCREEN_HEIGHT);

  for (let i = 0; i < SCREEN_WIDTH; i += 8) {
    let angle = player.angle - FOV / 2 + (i / SCREEN_WIDTH) * FOV;
    let cosA = Math.cos(angle);
    let sinA = Math.sin(angle);

    let d = castRayDist(player.x, player.y, cosA, sinA);
    let h = Math.min(SCREEN_HEIGHT, TILE * SCREEN_HEIGHT / d);
    let c = Math.floor(Math.max(0, 7 - d * 0.25)) / 7;
    g.setColor(c, c, c);
    let y = (SCREEN_HEIGHT - h) / 2;
    g.fillRect(i, y, i + 6, y + h);
  }

  renderZombies();
  renderHUD();

  if (zombies.length === 0) {
    g.setColor(0, 1, 0);
    g.drawString("LEVEL SUCCESS", cx - 80, cy);
  }
  g.flip();
}

function shoot() {
  let bullets = [{ x: cx, y: SCREEN_HEIGHT, s: 20, v: 3 + Math.random() * 2, hit: true }];
  let bulletTimer = setInterval(() => {
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      g.setColor(1, 1, 1).fillCircle(b.x, b.y, b.s);
      if (b.y > cy) b.y -= b.v;
      b.s *= 0.9;
      if (b.hit) {
        for (let j = 0; j < zombies.length; j++) {
          let z = zombies[j];
          let s = zombieScreenData(z);
          if (s && Math.abs(s.x - cx) < 20) {
            z.health--;
            if (z.health === 0) {
              player.kills++;
              g.setColor(1, 0, 0).drawString("KILL", cx, cy);
              setTimeout(() => zombies.splice(j, 1), 500);
            } else {
              g.setColor(1, 0, 0).drawString("HIT", cx, cy);
            }
            b.hit = false;
            break;
          }
        }
      }
      if (b.s < 2) bullets.splice(i, 1);
      else g.setColor(1, 0, 0).fillCircle(b.x, b.y, b.s);
    }
    g.flip();
  }, 100);
  setTimeout(() => clearInterval(bulletTimer), 2000);
}

let lastTouchTime = 0;
function handleTouch(p) {
  const now = getTime()*1000;
  if (now - lastTouchTime < 50) return; // throttle touch input to every 100ms
  lastTouchTime = now;

  const ROT = Math.PI / 12;
  if (p.x + p.y < cx + cy) {
    if (p.x > p.y) movePlayer(true);
    else {
      player.angle -= ROT;
      game.needsRender = true;
    }
  } else {
    if (p.x < p.y) movePlayer(false);
    else {
      player.angle += ROT;
      game.needsRender = true;
    }
  }
}

function startLevel(level) {
  game = { level, lastRender: 0, needsRender: true };
  player = { x: 0, y: 0, angle: 0, health: 0, kills: 0, lastHit: 0 };

  spawnZombies(level);
  resetPlayer();
  renderScene();

  // Remove old touch handlers
  touchHandlers.forEach(h => Bangle.removeListener("touch", h));
  touchHandlers = [
    (_, p) => handleTouch(p),
    p => handleTouch(p)
  ];
  Bangle.on("touch", touchHandlers[0]);
  Bangle.on("tap", touchHandlers[1]);

  if (renderInterval) clearInterval(renderInterval);
  renderInterval = setInterval(() => {
    frameCount++;
    moveZombies();

    if (player.health <= 0) {
      clearInterval(renderInterval);
      g.setBgColor("#000").clear();
      g.setColor(1, 0, 0).drawString("YOU DIED", cx - 50, cy);
      return;
    }

    if (game.needsRender || frameCount % 12 === 0) {
      game.needsRender = true;
      renderScene();
    }
  }, 150);

  setWatch(() => {
    if (player.health > 0 && zombies.length > 0) shoot();
    else if (zombies.length === 0) {
      clearInterval(renderInterval);
      setTimeout(() => startLevel(level + 1), 1500);
    }
  }, BTN1, { repeat: true });
}

function startGame() {
  startLevel(1);
}

function introAnim() {
  g.setBgColor("#000000").setColor(0).clear();
  const W = g.getWidth();
  const H = g.getHeight();

  function Drip() {
    this.x = Math.random() * W;
    this.y = 0;
    this.size = 2 + Math.random() * 3;
    this.speed = 2 + Math.random() * 2;
  }

  let drips = [new Drip()];

  function drawDrips() {
    g.clear();
    g.setColor(1, 0, 0); // Red color for blood

    drips.forEach((drip, i) => {
      g.fillCircle(drip.x, drip.y, drip.size);
      drip.y += drip.speed;

      // Add a smear effect for realism
      g.fillRect(
        drip.x - drip.size / 2,
        drip.y - drip.size,
        drip.x + drip.size / 2,
        drip.y
      );

      // Reset if it reaches the bottom
      if (drip.y > H) {
        drips[i] = new Drip();
      }
    });
    if (drips.length < 50) {
      drips.push(new Drip());
    }

    g.flip();
  }

  // Run the animation
  const dripInterval = setInterval(drawDrips, 50);
  setWatch(
    () => {
      clearInterval(dripInterval);
      startGame();
    },
    BTN1,
    { repeat: false }
  );
}

function titlePage() {
  g.clear();
  g.setFont("Vector", 20);
  g.setColor(0, 0, 0);
  g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  g.setColor(1, 1, 1);
  setTimeout(() => g.drawString("D", cx - 60, cy), 500);
  setTimeout(() => g.drawString("O", cx - 40, cy), 1000);
  setTimeout(() => g.drawString("O", cx - 20, cy), 1500);
  setTimeout(() => g.drawString("M", cx, cy), 2000);
  setTimeout(() => g.setFont("Vector", 10), 2500);
  setTimeout(() => g.drawString("(recreation)", cx + 20, cy), 3000);
  setTimeout(() => g.drawString("Harry Wixley 2025", cx - 60, cy+40), 3000);

  setWatch(
    () => {
      introAnim();
    },
    BTN1,
    { repeat: false }
  );
}

titlePage();
