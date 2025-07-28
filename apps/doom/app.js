
// ==== SCREEN VARIABLES ====
const SCREEN_WIDTH = 176;
const SCREEN_HEIGHT = 176;

let cx = SCREEN_WIDTH / 2,
  cy = SCREEN_HEIGHT / 2;

  // -- SPRITES --
const pistolSprite = {
  width : 44, height : 44, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([65535,4226,0,25124,23011,6339,27237,20931,14593,2145,16706,2113,4258,25091,8484,20898]),
  buffer : require("heatshrink").decompress(atob("ABcOCqtQCiUM93hCqUF8912AVT8IVTq1xCqVeu1uiAVRj1mt1RCiELq4VTgvuu9+9zDRiORiMV8AVP8sciIABbqHuAAgVPqtV81ur3lIKHM8d+qvsIKFRr3ritZIKFnje750bCp+Ru3rlfBzYVPiPm9O5iOSCp8B91b3lRyAVRiW1qOwCZsDpUZ8/FitcCpsDm04yvuiO8qsQCpsztUhjcilexiIVMs1msdR2Ui3NY0cwChUGCoMzvEbleI1VGsdACpN3u9Nv/4iMY1QVCu4VJ0906cznWIxQVBm00+4VJ199mxYB1WoxHzsfU1QVKFYUzsdjo1mntPxAUIhGq+ndCoMzRAXdpQVKxX3oZCBAAUz6n6CpNY1Gvodjml3okz7vX/GACpEVxGnu//vvToc97tP1AVJiOK//0IInUv+IqAVIVIOouZpBC4RWBwKYJhWojF2CQN3NgX4jYVJm2oYgU3FwMzo+oqIUIg9mm031GBiOx01kvWINhMHmhBBQoNEu82s+IwMQKxUVxVDQQc3xERKxOqqOK08zvWBjMYRQIqJVwNY1V30uykQAB2OoChLaC16RBCgQABjQRGA"))
}

function scaleSprite(sprite, scale) {
  const transparentIndex = sprite.transparent;

  // Original image buffer
  const srcG = Graphics.createArrayBuffer(sprite.width, sprite.height, sprite.bpp, {
    palette: sprite.palette,
    transparent: transparentIndex
  });
  srcG.drawImage(sprite, 0, 0);

  // New scaled buffer
  const dstG = Graphics.createArrayBuffer(
    sprite.width * scale,
    sprite.height * scale,
    sprite.bpp,
    {
      palette: sprite.palette,
      transparent: transparentIndex
    }
  );

  // Copy pixels with scaling, skip transparent
  for (let y = 0; y < sprite.height; y++) {
    for (let x = 0; x < sprite.width; x++) {
      const color = srcG.getPixel(x, y);
      if (color === transparentIndex) continue; // skip transparent

      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          dstG.setPixel(x * scale + dx, y * scale + dy, color);
        }
      }
    }
  }

  return {
    width: sprite.width * scale,
    height: sprite.height * scale,
    bpp: sprite.bpp,
    palette: sprite.palette,
    transparent: transparentIndex,
    buffer: dstG.buffer
  };
}

const zombieSprite = {
  width : 32, height : 48, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([65535,10597,54347,46288,42094,65011,16803,14823,16904,14820,43528,50186,48401,39719,12610,62832]),
  buffer : require("heatshrink").decompress(atob("AAnUolNwAPNonQB5e/qtfB5cL7/1/nbB5UC3fc7e/B5cil8vkQPKhvSlci7oPKhHb63b7APKw+N1Xdw/TogZDxEAglDmdIu3d614ofDpoOBw9xgFEnnDmndwMX7qSBptExAOBB4IAB5k702K3uNBAWBiAPBxvdDQNL1WqxGYwgPCIQQOBwwCB7Vm7tIvAuBxQPCPYOOtGJu2IogPBw+K1SLC2Utt3my48BpBLBiw1B0APC3FpyIOCw4PD01gB4NDpGRjAdCxGBzGWs1mB4ON6UthGEBoOIw8WtGeB4I/BxHSkgcCAANxjuGgwOCgGWNAOHvAOBs0RzGGZYkJDQQPDsOWB4sAjFxiMXw8RywPBwAPFiIABy2qs93xGGB40BDwJXBs7fBGYIPFEAN4s1qt3oIIJ8CAAkOtDPBt1oBwIPJxut93mszFBB49mxWGBgNmCQIPH81qDgQPB93gKA3m1QPBH4VuBwwPBBQPuJ4YPHBIJOCB5TXB91mzAvKgHoEAWY7GBB5GYzJbBzGIyIPIxGWB4OZcIIPIgxfBB4IABB5EAB4WXzIvJEAKrBzOeF5JxDyx/JYQQwBCQLOGUIgPBhIPL81u8AvM8xfBs2q0w/K9wyBB5YACF4NpB5kBiOQA4gA="))
}

let zombieSprites = [];
for (let i = 1; i < 3; i+=0.25) {
  zombieSprites.push(scaleSprite(zombieSprite, i));
}

function chooseZombieSprite(s) {
  for (let i = zombieSprites.length - 1; i >= 0; i--) {
    if (s.h >= zombieSprites[i].height*0.8) return zombieSprites[i];
  }
  return zombieSprites[0]; // fallback to smallest
}


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
const CROSSHAIR_RADIUS = SCREEN_WIDTH / 8;

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

function hasLineOfSight(z) {
  // Convert world coords to tile coords (as floats)
  let tileX = Math.floor(z.x / TILE);
  let tileY = Math.floor(z.y / TILE);

  const endX = Math.floor(player.x / TILE);
  const endY = Math.floor(player.y / TILE);

  const dx = player.x - z.x;
  const dy = player.y - z.y;

  if (dx == 0 && dy == 0) {
    return true;
  }

  const stepX = dx > 0 ? 1 : -1;
  const stepY = dy > 0 ? 1 : -1;

  const deltaDistX = Math.abs(TILE / dx);
  const deltaDistY = Math.abs(TILE / dy);

  let sideDistX, sideDistY;

  if (dx === 0) {
    sideDistX = Infinity;
  } else {
    const offsetX = (stepX > 0)
      ? TILE - (z.x % TILE)
      : (z.x % TILE);
    sideDistX = (offsetX / Math.abs(dx)) * TILE;
  }

  if (dy === 0) {
    sideDistY = Infinity;
  } else {
    const offsetY = (stepY > 0)
      ? TILE - (z.y % TILE)
      : (z.y % TILE);
    sideDistY = (offsetY / Math.abs(dy)) * TILE;
  }

  while (tileX !== endX || tileY !== endY) {
    if (sideDistX < sideDistY) {
      sideDistX += deltaDistX * TILE;
      tileX += stepX;
    } else {
      sideDistY += deltaDistY * TILE;
      tileY += stepY;
    }

    // Bounds check
    if (tileY < 0 || tileY >= MAP.length || tileX < 0 || tileX >= MAP[0].length)
      return false;

    if (MAP[tileY][tileX] === 1) return false; // wall hit
  }

  return true;
}

function getZombiesByDistance(ascending) {
  return zombies
    .map(z => {
      const dx = z.x - player.x;
      const dy = z.y - player.y;
      return {
        zombie: z,
        distSq: dx * dx + dy * dy
      };
    })
    .sort((a, b) => (ascending ?? true) ? a.distSq - b.distSq : b.distSq - a.distSq)
    .map(entry => entry.zombie);
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
  // h = MAP.length
  let w = h / 3;
  let sx = cx + Math.tan(-diff) * cx;
  let sy = cy + 400 / d;
  return { x: sx, y: sy, w: w, h: h };
}

let lastFetchTime = 0;
function renderZombies() {
  let zombos = zombies;
  const now = getTime()*1000;
  if (now - lastFetchTime < 1000) zombos = getZombiesByDistance(false); // throttle shoot input to every 100ms
  lastFetchTime = now;
  
  for (let i = 0; i < zombos.length; i++) {
    let z = zombos[i];
    if (!hasLineOfSight(z)) continue;
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
    let sprite = chooseZombieSprite(s); //zombieSprite;
    // if (s.h > zombieSprite3x.height) {
    //   sprite = zombieSprite4x;
    // } else if (s.h > zombieSprite2x.height) {
    //   sprite = zombieSprite3x
    // } else if (s.h > zombieSprite.height) {
    //   sprite = zombieSprite2x;
    // }
    // sprite.width =
    // g.fillRect(s.x - s.w / 2, s.y - s.h / 2, s.x + s.w / 2, s.y + s.h / 2);
    g.drawImage(sprite, s.x - s.w / 2, s.y - s.h / 2)
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
  g.setColor(85,85,85)
  // g.fillRect(cx - CROSSHAIR_RADIUS*1.5, cy, cx - CROSSHAIR_RADIUS*0.5, cy)
  // g.fillRect(cx, cy - CROSSHAIR_RADIUS*0.5, cx, cy - CROSSHAIR_RADIUS*1.5)
  // g.fillRect(cx + CROSSHAIR_RADIUS*0.5, cy, cx + CROSSHAIR_RADIUS*1.5, cy)
  // g.fillRect(cx, cy + CROSSHAIR_RADIUS*1.5, cx, cy+CROSSHAIR_RADIUS*0.5)
  g.drawImage(pistolSprite, cx-pistolSprite.width/2, SCREEN_HEIGHT-pistolSprite.height);
}

function renderScene() {
  if (!game.needsRender) return;
  game.needsRender = false;
  // game.lastRender = getTime() * 1000;

  g.clear();
  g.setColor(0, 0, 0).fillRect(0, 0, SCREEN_WIDTH, cy);
  g.setColor(0.5, 0.25, 0).fillRect(0, cy, SCREEN_WIDTH, SCREEN_HEIGHT);
  let COL_WIDTH = 12

  for (let i = 0; i < SCREEN_WIDTH; i += COL_WIDTH) {
    let angle = player.angle - FOV / 2 + (i / SCREEN_WIDTH) * FOV;
    let cosA = Math.cos(angle);
    let sinA = Math.sin(angle);

    let d = castRayDist(player.x, player.y, cosA, sinA);
    let h = Math.min(SCREEN_HEIGHT, TILE * SCREEN_HEIGHT / d);
    let c = Math.floor(Math.max(0, 7 - d * 0.25)) / 7;
    g.setColor(c, c, c);
    let y = (SCREEN_HEIGHT - h) / 2;
    g.fillRect(i, y, i + COL_WIDTH, y + h);
  }

  renderZombies();
  renderHUD();

  if (zombies.length === 0) {
    g.setColor(0, 1, 0);
    g.drawString("LEVEL SUCCESS", cx - 80, cy);
  }
  g.flip();
}

let lastShootTime = 0;
function shoot() {
  const now = getTime()*1000;
  if (now - lastShootTime < 100) return; // throttle shoot input to every 100ms
  lastShootTime = now;
  let zombos = getZombiesByDistance();
  for (let j = 0; j < zombos.length; j++) {
    let z = zombos[j];
    let s = zombieScreenData(z);
    if (s && Math.abs(s.x - cx) <= s.w/2) {
      z.health--;
      if (z.health <= 0) {
        player.kills++;
        g.setColor(1, 0, 0).drawString("KILL", cx, cy);
        setTimeout(() => zombies.splice(j, 1), 500);
      } else {
        g.setColor(1, 0, 0).drawString("HIT", cx, cy);
      }
      break;
    }
  }

  let bullets = [{ x: cx, y: SCREEN_HEIGHT-pistolSprite.height, s: 4, v: 15 + Math.random() * 2, hit: true }];
  let bulletTimer = setInterval(() => {
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      g.setColor(1, 1, 1).fillCircle(b.x, b.y, b.s);
      if (b.y > cy) b.y -= b.v;
      b.s *= 0.68;
      if (b.s < 2) bullets.splice(i, 1);
      else g.setColor(1, 0, 0).fillCircle(b.x, b.y, b.s);
    }
    g.flip();
  }, 100);
  setTimeout(() => clearInterval(bulletTimer), 500);
}

let lastTouchTime = 0;
function handleTouch(p) {
  const now = getTime()*1000;
  if (now - lastTouchTime < 100) return; // throttle touch input to every 100ms
  lastTouchTime = now;

  const ROT = Math.PI / 14;
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
    if (player.health <= 0) {
      clearInterval(renderInterval);
      setTimeout(() => startLevel(1), 1500);
    } else if (zombies.length > 0) shoot();
    else {
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
  let rendered = false;
  g.clear();
  g.setFont("Vector", 20);
  g.setColor(0, 0, 0);
  g.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  g.setColor(1, 1, 1);
  setTimeout(() => rendered ? {} : g.drawString("D", cx - 60, cy), 500);
  setTimeout(() => rendered ? {} : g.drawString("O", cx - 40, cy), 1000);
  setTimeout(() => rendered ? {} : g.drawString("O", cx - 20, cy), 1500);
  setTimeout(() => rendered ? {} : g.drawString("M", cx, cy), 2000);
  setTimeout(() => rendered ? {} : g.setFont("Vector", 10), 2500);
  setTimeout(() => rendered ? {} : g.drawString("(recreation)", cx + 20, cy), 3000);
  setTimeout(() => rendered ? {} : g.drawString("Harry Wixley 2025", cx - 60, cy+40), 3000);

  setWatch(
    () => {
      rendered = true;
      introAnim();
    },
    BTN1,
    { repeat: false }
  );
}

titlePage();
