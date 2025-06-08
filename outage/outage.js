// SETUP

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let vx = 0;
let vy = 0;
let x = 100;
let y = 100;
let key = new Set();
let colors = ["#6184FA","#9183EC","#F497DA"] //blue purple pink
let mode = 1

// BULLET

class Bullet {
  constructor(x, y, vx, vy, type) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
  }

  move() {
    this.x += this.vx;
    this.y -= this.vy;
  }

  draw(color) {
    ctx.fillStyle = color;
    ctx.fillRect(this.x, this.y, 10, 10);
  }
}

const bullets = [];


class Enemy {
  constructor(x, y, mv, mood, type) {
    this.x = x;
    this.y = y;
    this.mv = mv;
    this.mood = mood;
    this.type = type;
  }
  
  move() {
    let wx = x + vx;
    let wy = y - vy;
  
  }

}

const enemies = new Set();


// DRAW RECT
function drawRect(rx,ry,rw,rh,rc) {
  ctx.fillStyle = rc;
  ctx.strokeStyle = rc;
  return ctx.fillRect(rx, ry, rw, rh);
}


// KEY READING
document.addEventListener("keydown", (e) => {
  if (mode == 1) {
    key.add(e.key);
  } else if (!e.repeat) {
    key.add(e.key);
  }
});
document.addEventListener("keyup", (e) => {
  key.delete(e.key);
});



// GAME BEGIN!

let game = setInterval(function () {
  ctx.clearRect(0, 0, 500, 400);

  

  //MOVEMENT
  if (mode == 1) {
    vx += .4 * (key.has("d") - key.has("a"));
    vy += .4 * (key.has("s") - key.has("w"));
  }

  //SHOOT
  if (mode == 2) {
    if (['a', 'd'].some(x => key.has(x))) {
      bullets.push(new Bullet(x + 5, y + 5, 5 * (key.has("d") - key.has("a")), -vy, "player"));
      ['a', 'd'].forEach(x => key.delete(x));
    } else if (['w', 's'].some(x => key.has(x))) {
      bullets.push(new Bullet(x + 5, y + 5, vx, 5 * (key.has("w") - key.has("s")), "player"));
      ['w', 's'].forEach(x => key.delete(x));
    }
  }

  if (mode == 0) {
    vx *= 0.99;
    vy *= 0.99;
  } else {
    vx *= 0.9;
    vy *= 0.9;
  }
  x += vx;
  y += vy;

  // COLOR SWAP
  if (key.has("i")) {
    mode = 0;
    key.delete("i");
  }
  if (key.has("o")) {
    mode = 1;
    key.delete("o");
  }
  if (key.has("p")) {
    mode = 2;
    key.delete("p");
  }

  // DRAW BULLETS
  for (let bul of bullets) {
    bul.draw("#abf1ff")
    bul.move()
  }
  
  // DRAW PLAYER
  drawRect(x,y,20,20,colors[mode]);

  //DRAW STATS
  ctx.fillStyle = "white";
  ctx.font = "10px Arial";
  ctx.fillText(`${x.toFixed(2)}, ${y.toFixed(2)}`, 10, 20);
  ctx.fillText(`mode: ${mode}`, 10, 30);
}, 10);