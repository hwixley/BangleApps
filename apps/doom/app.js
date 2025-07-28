
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

const zombieSprite1 = {
  width : 32, height : 48, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([65535,10597,54347,46288,42094,65011,16803,14823,16904,14820,43528,50186,48401,39719,12610,62832]),
  buffer : require("heatshrink").decompress(atob("AAnUolNwAPNonQB5e/qtfB5cL7/1/nbB5UC3fc7e/B5cil8vkQPKhvSlci7oPKhHb63b7APKw+N1Xdw/TogZDxEAglDmdIu3d614ofDpoOBw9xgFEnnDmndwMX7qSBptExAOBB4IAB5k702K3uNBAWBiAPBxvdDQNL1WqxGYwgPCIQQOBwwCB7Vm7tIvAuBxQPCPYOOtGJu2IogPBw+K1SLC2Utt3my48BpBLBiw1B0APC3FpyIOCw4PD01gB4NDpGRjAdCxGBzGWs1mB4ON6UthGEBoOIw8WtGeB4I/BxHSkgcCAANxjuGgwOCgGWNAOHvAOBs0RzGGZYkJDQQPDsOWB4sAjFxiMXw8RywPBwAPFiIABy2qs93xGGB40BDwJXBs7fBGYIPFEAN4s1qt3oIIJ8CAAkOtDPBt1oBwIPJxut93mszFBB49mxWGBgNmCQIPH81qDgQPB93gKA3m1QPBH4VuBwwPBBQPuJ4YPHBIJOCB5TXB91mzAvKgHoEAWY7GBB5GYzJbBzGIyIPIxGWB4OZcIIPIgxfBB4IABB5EAB4WXzIvJEAKrBzOeF5JxDyx/JYQQwBCQLOGUIgPBhIPL81u8AvM8xfBs2q0w/K9wyBB5YACF4NpB5kBiOQA4gA="))
}
const zombieSprite2 = {
  width : 64, height : 95, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([65535,12610,20965,10597,16771,42094,12642,16936,16904,14690,58540,16803,14823,14791,41415,6305]),
  buffer : require("heatshrink").decompress(atob("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"))
}
const zombieSprite3 = {
  width : 96, height : 143, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([65535,12610,10597,16771,20965,16904,6305,42094,14690,16936,8484,8452,16803,19049,12642,14791]),
  buffer : require("heatshrink").decompress(atob("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"))
}
const zombieSprite4 = {
  width : 128, height : 190, bpp : 4,
  transparent : 0,
  palette : new Uint16Array([65535,12610,16771,10597,20965,6305,16904,8452,16936,8484,14690,14791,12642,19049,16803,24641]),
  buffer : require("heatshrink").decompress(atob("ACXdABvQH/4//H9+Ixo+LxGAH9/umg4E7BGF93gH+wAGH+U9H/4//H/4/Lnw/wolNH5dEoA//H/4/v6g/N6A9thozC92NHo/e8gECINg/Dnw/I7k0H+XUH/xBC/9NAwdP/5EEH+Pf//z5AFB4fvIwo/0nA/9X/oANH/4//H9gABoj7EAA9EoA9tH4VEHxXUH/4/4YwwGBHtsNGII/F//0Iw/QH/4/x6g/2HoPb3czmg+BGoRGCAwXUmc2xBHEAAIrPCiY/Eyg7CHAI/CAwd5y2GH/l3yx/t7GI3e0G4IAJ3YABH43QFR4ABxe7JZYAG7GLmc0Ho9DneIBoIaJIRA8D3e47u3u4/SGISBIH7loH4OZP6fbH5dmta/HP6ONH4w9LAAXUl0reoUikczAAfu9obMIIblGzMz3cwPqI/E8Y4CzIAByY/aa4N5DwI/WPQg/GkR/ZH4zLDACD6BiIABne7AwNEpodSxFrcAR7FH63Uoms5nMkg+CDifW3e3u6ZBH8HBH7G23OZH7/UkUi1XkP7A/gAAL6H6nukczDR3bHpQ/hl0pyY/PvI//H8oADH4NEoUiX6EwHxMAgglDNIhvEH5g6Bu90olO91mtcz3oaK6czH5w4FH6VO8V3yhEBl1oxY/kQwo/M8m7HAIXC6w/M61EoA/MHwYuEqtdI4oAFmc5zLZGAAMzmezBI3YxAEC6A/PGYo/bmY//Xg4/PhvUa4/UqteJYQ9GkUkAobaDAAdmtY/Es2NdQoWBH5Q+HH4VRiI1EAAOzmeZyn/+g/IWgI/BHQXbme2ww/d1nkH4+Xug/R6w/Bsw/Ze4J/J21rXhS/FtvdwwEB3q/PPpPdoXqqoABjnKl3i5kZy4sBEoQaJ7u7SAIABzOZy4/BCwRoBAAI//H7nJzLsBH6mZH7IUB8MRiMeoks5kzndmPoL4JAAJLB7vYH4uUHAQAD/4ABH48EMo4VBkMR5mkolM4OZveIPBYABJoXWH5lPH7fMy4/T2w/Eug/Tpo/H8Uimc+3ZEBX4I+K7u2H4eGwx/Emc0HAS9EH5YABFAlCkQIBmc5vOZzIQHAAPbPgWIHQI/Bte7KgIKB33u946EAAX+9w/WHwI/UtY/D3Y/VX4w/HyY+IH41rxp/H8Q/I+lEH48NFg/UCQVVqcz3oPHs1m3doxAEBxA9B61mfIMi9pNB30Rj48EkQABMYI/XVgIAGPYRLBxAABH4KGBH4PuH5XuAAI/ZP5A/KfoI/iAAIMBHpPYXQVmX4IABXoRIBmcxiOtCQOEiMaX4skHwI/HFQg/IHo6xBAAI7CPonTPgMzl3hqtQDgQ/BPQRAC+lEoB+HH/6rEH7RbBH4fkoURiA/DiXu8UiH53bme0og2HJQVmtoEC3e47uGsx8ExGGmc5zN3u4ZC6nuFoUEolP/76IH480H5XW3doOII/B3o4BXguIxY//H72Ix2ZkgRBpr4J3A0BYgi6CC4IABpY8BzOTmYOC7w/DACNEp0Rig/J3e7mZ6BAA2Iwku9wAB8Q/By873ZICpw/Wxw/ZHwQ/j0g/IfAI/KeIQAB8lCH70AggcCFwnWs2z2czAAL6DH4/q1Xkp0znI/CI4I/ZpY/G7e7HwY/M9nMH/4/KkQ/VIIQ/D6z6BfYIADA4W2B4XY7G72hzCAQMRic5mj+ColN7o/Xg933osBHgoALu9+GwdO5nDmY/EKQI/XhOXH6mZH9GZ3FmH5cildEpey2YHBnw/EkUjmckX7o/BOxe4wwsCp//oYJBneIwYECIIPiB4Pu8lEoA+XH8HuH/4/eAAI9JmUiFII8Bon///0og6B3YABs297oAB6hRCAwQEBH6+ZQJE+9xqBHgIAEH4W4xGIto/9ww/kg4/GGIOykUkXgQACFgOzX4eNG4Q/EolNH7SBCyY/ExFvPg3/pGGHgMzmtVGoI9FoiWBKAMzH/4/rs27F4I/pgEJnI+B3e2FgdPHwdPk93iMXu8UeoI9GAAfikWs0A/ZzI/DFINNAQI+C+lEktVAAQ/BAAlCHwhAC1nAH8AACH6FOH8UAvI/C2h+B7oyFolBiI+BiI/JXYMuH70AhnMl0kH4TwB7oADAwNVqOsB4PiPQ/M0Q/x5gPBXRA/z4I/NkUiH7/kdgRBBAYI9Cor/Cqr/DHwmq1XM5Wql//H9XlHwQ/J1nMAAQ//H8PuF4QAGkK/I8T3BkS/CAQMkoQ/g9yBDAAVKiMu8Q/CiR7DOwP84P//XM1//DwI/pBYI/Djw/N8Q/ekRABH5sSkQ+BkQ/B+OqH4MaH4PykQ/ecQJuCHwfu9XMJAMRAAMa1RGBCgOqHQIAGH73M5Q/HlQ/C1gPBAAI/BAgQ/x9XBH+IAB5nBiMUf4tOIwNOH4WuJoUikQ9H+sRHrg/DqtUHodP//0olC8Q/CkiLD94/HitVH9VOXAY/El4/piNVX4h/EkWq1Q/O+o/fAAMiGIIoC+WqfAMs1Uu9XBBoNO9w/JAAI/g93kH4nM0Q/B5XuH4dCH+p/CH5HvH9EB4Q8DkQ0B5nBiMc5T/GolPHo4ZBH73M5QlC/nM93i5kRH4PMAAQ/DPpMu9w/k5UuH++q0QlC/WqkUqHwK/JH5MiX74lEp3i1j9BH4fu9Q/CBoISC/wEDAAMs5g//H/4/egEP//ykku9z/EHQOq0Uipvdp71CkUvHofy1WgHz6BC+XuAAXqPoPM8lE1nC8Q/DB4Q/E/R9gH5UR4I/D9x/Flw/q/WqXANEoURjWql3i1nK1XtH4PyBwIAELII/jgEFqsUFgSDCitVjnBqtQgHukndAA3bmY//H/4/jgMR9GId4nhiPMH4uIxo9D7GIwY/khnBH4tI9nMH4suxAAFomzP9lI8I/G8g/G3Y/lh3upC/GH4silxKBHweEolDH8kNdIQ9Cp3ulg/FzNzQIQ8Bom0//zzI/0yY/4iMRH+QABp/0HoMulWq1h9BAAI/Bmc7BoOqAAcile7H8sP/9Lp0ilS9DH4uIx0cBgIAC4lEH89Ixw/D0I/HwTIBAAY/p93u1WhGIcVH4czP4IPBAAVEpa/mAAJ9CHQIABQIQ/B5keolIxAACxvd6czH90c4I/41Q/D5R/LxA/qgEO93ikWhiJGBiMQH4b4B9WqAAWjH9MAH4Ws5TGCH43s5gAC4Y/58I/vgCxBH4Ui1WgH4WIxe793u5nK/8jH9cMN4I/CkUgH4oAB1nC//zH/4/rhWqAAI/Ejg/BwnkX4Oq0Q/tgUi///1XCkWlqoKBmc///yJIMu93v/4/uWYI/L3Y//H9kBiIyB1nK1UVH4W72Uip5MB+Xu8A+qH4WikXMAAI/E30il4/B/8ikA/3P4I/xhWqX4R/Hly/CH9pxEH40Ahe7ogABIQPwH/4//H+Wu9wLBom+93kIAUiklEH+OkGYVEp0u9wADIgI/xOYY/z0OvH4fBiPEH4nuXwQADH9NVr//lh9B4NVqALCfog//H/4/uiMSkWsH/fM0Q//H4ehH/EciIAEqoLDHo4/rgEFqoACPoY//H/4/2ABW72g6CkUkolL3Y/1mc0olO90il1EoczH/4/2mUi9w/7gEHu8zAAcwH20AhOZH/4/bA"))
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
    let sprite = zombieSprite1;
    if (s.h > zombieSprite3.height) {
      sprite = zombieSprite4;
    } else if (s.h > zombieSprite2.height) {
      sprite = zombieSprite3
    } else if (s.h > zombieSprite1.height) {
      sprite = zombieSprite2;
    }
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
