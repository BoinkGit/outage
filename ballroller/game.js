const canvas = document.getElementById("game"); 
const ctx = canvas.getContext("2d");  
 
const WIDTH = canvas.width; 
const HEIGHT = canvas.height; 

class Mouse {
  constructor(x, y, last) {
    [this.x, this.y] = [x, y];
    this.last = last
    this.new = 0;;
  }
}

const mouse = new Mouse()

canvas.addEventListener("mousedown", (e) => {
  [mouse.x, mouse.y] = [e.offsetX, e.offsetY];
  mouse.last = e.click;
  mouse.new = 1;
});

const balls = new Set();

setInterval(() => { 
  ctx.clearRect(0, 0, WIDTH, HEIGHT); 
  
  if (mouse.new == 1) {
    balls.add(new Ball(mouse.x - (mouse.x % 20) + 10, 270));
  }

  balls.forEach((b) => {
    if (b.alive == 0) {
      balls.delete(b);
    }
    b.draw();
    b.push();
  })

  mouse.new = 0;
}, 10); 
