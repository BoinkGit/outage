class Ball {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.alive = 1;
    this.offx = 0;
  }
  
  push() {
    this.y -= 5;
    this.offx += Math.sin( 5*(270 + this.y));
    if (this.y <= -10) {
      this.alive = 0;
    }
  }

  draw() {
    //ctx.fillStyle = "gold";
    //ctx.fillRect(this.x - 10, 0, 20, 300)
    ctx.fillStyle = "red";
    ctx.fillRect(this.x - 10 + this.offx, this.y-10, 20, 20);
  }
}