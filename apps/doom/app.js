
// ==== SCREEN VARIABLES ====
const SCREEN_WIDTH = 176;
const SCREEN_HEIGHT = 176;

let cx = SCREEN_WIDTH / 2,
  cy = SCREEN_HEIGHT / 2;

function startGame() {
  g.clear();

  // === Constants ===
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
  const START_X = 2 * TILE, START_Y = 2 * TILE;

  let game = { level: 1, lastRender: 0, needsRender: true };
  let player = { x: START_X, y: START_Y, angle: 0, health: MAX_HEALTH, kills: 0, lastHit: 0 };
  let zombies = [];

  const cx = SCREEN_WIDTH >> 1, cy = SCREEN_HEIGHT >> 1;

  function resetPlayer() {
    player.x = START_X;
    player.y = START_Y;
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
      zombies.push({ x: zx, y: zy, health: 5, speed: 0.05 });
    }
  }
  spawnZombies(game.level);

  function moveZombies() {
    let now = getTime() * 1000;
    zombies.forEach(z => {
      let dx = player.x - z.x, dy = player.y - z.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > 0.5) {
        dx /= dist; dy /= dist;
        let rand = Math.random() + 0.25;
        z.x += dx * z.speed / rand;
        z.y += dy * z.speed / rand;
      } else if (now - player.lastHit > 500) {
        player.health--;
        player.lastHit = now;
        g.setBgColor("#f00").setColor(0).clear();
      }
    });
  }

  function dist(x1,x2,y1,y2) {
    "compiled";
    let dx = x1 - x2, dy = y1 - y2;
    return Math.sqrt(dx*dx + dy*dy);
  }

  function castRayDist(angle) {
    "compiled";
    let x = player.x, y = player.y;
    let cos = Math.cos(angle), sin = Math.sin(angle);
    while (true) {
      x += cos;
      y += sin;
      let tx = Math.floor(x / TILE), ty = Math.floor(y / TILE);
      if (MAP[ty] && MAP[ty][tx] === 1) break;
    }
    return dist(x, player.x, y, player.y);
  }

  function movePlayer(backward) {
    let dir = backward ? -1 : 1;
    let nx = player.x + Math.cos(player.angle) * TILE/4 * dir;
    let ny = player.y + Math.sin(player.angle) * TILE/4 * dir;
    let tx = Math.floor(nx / TILE), ty = Math.floor(ny / TILE);
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
    zombies.forEach(z => {
      let s = zombieScreenData(z);
      if (!s) return;
      g.setColor(z.health > 0 ? 0 : 1, z.health > 0 ? 1 : 0, 0);
      g.fillCircle(s.x, s.y - s.h/2 - 20, 10);
      g.setColor(1,1,1);
      g.drawString(z.health, s.x, s.y - s.h/2 - 30);
      g.setColor(z.health > 0 ? 0.12 : 1, z.health > 0 ? 0.56 : 0, 0);
      g.fillRect(s.x - s.w/2, s.y - s.h/4, s.x + s.w/2, s.y + s.h/4);
      g.fillRect(s.x - s.w/2 + 10, s.y - s.h/2, s.x + s.w/2 - 10, s.y + s.h/2);
    });
  }

  function renderHUD() {
    g.setColor(1,0,0).fillRect(40, SCREEN_HEIGHT-40, SCREEN_WIDTH-40, SCREEN_HEIGHT-20);
    g.setColor(0,1,0).fillRect(40, SCREEN_HEIGHT-40,
      40+(SCREEN_WIDTH-80)*(player.health/MAX_HEALTH), SCREEN_HEIGHT-20);
    g.setFont("Vector",10).drawString("Zombies:", 20, 20);
    g.setFont("Vector",20).drawString(zombies.length, 20, 30);
    g.setFont("Vector",10).drawString("Level "+game.level, cx-10, 20);
    g.drawString("Kills:", SCREEN_WIDTH-40, 20);
    g.setFont("Vector",20).drawString(player.kills, SCREEN_WIDTH-40, 30);
  }

  function renderScene() {
    "compiled";
    if (!game.needsRender) return;
    game.needsRender = false;
    game.lastRender = getTime() * 1000;
    g.clear();

    g.setColor(0,0,0).fillRect(0,0,SCREEN_WIDTH,cy);
    g.setColor(0.5,0.25,0).fillRect(0,cy,SCREEN_WIDTH,SCREEN_HEIGHT);

    for (let i = 0; i < SCREEN_WIDTH; i++) {
      let angle = player.angle - FOV/2 + (i/SCREEN_WIDTH) * FOV;
      let d = castRayDist(angle);
      let h = Math.min(SCREEN_HEIGHT, TILE * SCREEN_HEIGHT / d);
      let c = Math.floor(Math.max(0, 7 - d * 0.25)) / 7;
      g.setColor(c,c,c);
      let y = (SCREEN_HEIGHT - h)/2;
      g.fillRect(i, y, i+1, y+h);
    }

    renderZombies();
    renderHUD();

    if (zombies.length == 0) {
      g.setColor(0,1,0);
      g.drawString("LEVEL SUCCESS", cx - 80, cy);
    }

    g.flip();
  }

  function shoot() {
    let bullets = [{ x: cx, y: SCREEN_HEIGHT, s: 20, v: 3 + Math.random() * 2, hit: true }];
    let timer = setInterval(() => {
      bullets.forEach((b,i) => {
        g.setColor(1,1,1).fillCircle(b.x,b.y,b.s);
        if (b.y > cy) b.y -= b.v;
        b.s *= 0.9;

        if (b.hit) {
          zombies.forEach((z,j) => {
            let s = zombieScreenData(z);
            if (s && Math.abs(s.x - cx) < 20) {
              z.health--;
              if (z.health == 0) {
                player.kills++;
                g.setColor(1,0,0).drawString("KILL", cx, cy);
                setTimeout(() => zombies.splice(j,1), 500);
              } else {
                g.setColor(1,0,0).drawString("HIT", cx, cy);
              }
              b.hit = false;
            }
          });
        }

        if (b.s < 2) bullets.splice(i,1);
        else g.setColor(1,0,0).fillCircle(b.x,b.y,b.s);
      });
      g.flip();
    }, 100);
    setTimeout(() => clearInterval(timer), 2000);
  }

  function handleTouch(p) {
    let ROT = Math.PI / 16;
    if (p.x + p.y < cx + cy) {
      if (p.x > p.y) movePlayer(true);
      else { player.angle -= ROT; game.needsRender = true; }
    } else {
      if (p.x < p.y) movePlayer(false);
      else { player.angle += ROT; game.needsRender = true; }
    }
  }

  Bangle.on("touch", (_, p) => handleTouch(p));
  Bangle.on("tap", p => handleTouch(p));

  let renderInterval = setInterval(() => {
    moveZombies();
    if (player.health <= 0) {
      clearInterval(renderInterval);
      g.setBgColor("#000").clear();
      g.setColor(1,0,0).drawString("YOU DIED", cx - 50, cy);
      return;
    }
    if (game.needsRender || getTime()*1000 - game.lastRender > 500)
      renderScene();
  }, 100);

  setWatch(() => {
    if (player.health > 0 && zombies.length > 0) shoot();
    else {
      if (zombies.length == 0) {
        game.level++;
        spawnZombies(game.level);
      }
      resetPlayer();
      game.needsRender = true;
    }
  }, BTN1, { repeat: true });

  renderScene();
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
