// constants
const canvas = document.getElementById("screen");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const COLORS = new Map();
COLORS.set("player", "#ff0000").set("push", "#0055ff").set("pull", "#11cc00");
COLORS.set("wall", "#888888");

// images
const levelP = document.getElementById("level");

const bg = new Image();
bg.src = "imgs/wood.png";

const neutral = new Image();
const up = new Image();
const down = new Image();
const left = new Image();
const right = new Image();

neutral.src = "imgs/neutral.png";
down.src = "imgs/down.png";
up.src = "imgs/up.png";
left.src = "imgs/left.png";
right.src = "imgs/right.png";

const blockImgs = new Map();
const wall = new Image();
const push = new Image();
const pull = new Image();
const goal = new Image();

wall.src = "imgs/wall.png";
push.src = "imgs/push.png";
pull.src = "imgs/pull.png";
goal.src = "imgs/goal.png";

blockImgs
  .set("wall", wall)
  .set("push", push)
  .set("pull", pull)
  .set("goal", goal);

// key detection
let key = "";

document.addEventListener("keydown", (e) => {
  if (!e.repeat) {
    key = e.key;
  }
});

document.addEventListener("keyup", (e) => {
  key = "";
});

// blocks
const blocks = new Set();

class block {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  draw(dist) {
    ctx.drawImage(
      blockImgs.get(this.type),
      this.x * dist,
      this.y * dist,
      dist,
      dist,
    );
  }
}

// variables
let x = 0;
let y = 0;
let dist = Math.sqrt(WIDTH * HEIGHT) / 10;
let deltaM = 0;
let direction = "";
let level = 0;

// music!
const bgm = new Audio("music/puzzlemusic.mp3");
const mute = document.getElementById("mute");

bgm.volume = 0.5;
bgm.loop = true;
let music = 0;

mute.addEventListener("click", (e) => {
  if (music == 0) {
    bgm.play();
    music = 1;
    mute.innerHTML = "UNMUTED🔊";
  } else {
    bgm.volume = -1 * bgm.volume + 0.5;
    if (bgm.volume == 0) {
      mute.innerHTML = "MUTED🔈";
    } else {
      mute.innerHTML = "UNMUTED🔊";
    }
  }
});

// borders

const border = (level) => {
  for (let i = 0; i < 10; i++) {
    level.add(new block(i, -1, "wall"));
    level.add(new block(i, 10, "wall"));
    level.add(new block(-1, i, "wall"));
    level.add(new block(10, i, "wall"));
  }
};

// level make helper
const longwall = (x, y, lw) => {
  for (let i = x; i <= lw; i++) {
    blocks.add(new block(i, y, "wall"));
  }
};

const tallwall = (x, y, lh) => {
  for (let i = y; i <= lh; i++) {
    blocks.add(new block(x, i, "wall"));
  }
};

const bl = (x, y, t) => {
  blocks.add(new block(x, y, t));
};

// levels
const lvl1 = () => {
  longwall(0, 3, 6);
  longwall(6, 2, 9);
  longwall(0, 5, 6);
  longwall(6, 6, 9);

  bl(4, 4, "push");
  bl(9, 4, "goal");

  x = 0;
  y = 4;
};

const lvl2 = () => {
  longwall(0, 2, 3);
  longwall(3, 3, 9);
  longwall(0, 6, 3);
  longwall(3, 5, 9);

  bl(6, 4, "pull");
  bl(8, 4, "goal");

  x = 1;
  y = 4;
};

const lvl3 = () => {
  longwall(0, 2, 3);
  longwall(3, 3, 9);
  longwall(0, 7, 3);
  longwall(3, 6, 9);

  bl(3, 4, "push");
  bl(3, 5, "push");
  bl(6, 4, "pull");
  bl(6, 5, "pull");
  bl(9, 5, "goal");

  x = 1;
  y = 5;
};

const lvl4 = () => {
  longwall(0, 2, 8);
  longwall(0, 6, 2);
  longwall(8, 6, 9);
  longwall(2, 8, 8);
  
  for (let i = 0; i < 9; i += 2) {
    bl(i, 4, "wall");
  }

  bl(4, 6, "wall");
  bl(2, 7, "wall");
  bl(8, 7, "wall");
  bl(0, 3, "wall");
  bl(4, 3, "wall");
  bl(8, 3, "wall");
  bl(9, 4, "wall");
  bl(6, 6, "wall");
  
  bl(3, 5, "pull");
  bl(5, 5, "pull");
  bl(7, 5, "push");
  bl(8, 5, "pull");

  bl(9, 5, "goal");
  
  x = 0;
  y = 5;
}

const end = () => {
  bl(6,5,"wall");
  bl(4,5,"wall");
  bl(5,6,"wall");
  bl(5,4,"wall");

  bl(5,7,"goal");

  x = 5;
  y = 5;
}

const levels = [lvl1, lvl2, lvl3, lvl4, end];

const play = (level) => {
  blocks.clear();
  border(blocks);
  levels[level]();
};

play(level);

// start game
setInterval(() => {
  // clear screen
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.drawImage(bg, 0, 0);

  // reset
  if (key == "r") {
    play(level);
  }

  // check if move attempt
  ["w", "a", "s", "d"].some((i) => {
    if (key == i) {
      deltaM = 50;
      direction = i;
    }
  });

  // move blocks
  blocks.forEach((b) => {
    if (b.type == "push") {
      if (x == b.x) {
        if (Math.abs(y - b.y) == 1) {
          if (
            [...blocks].some((i) => {
              return i.x == x && i.y + 2 == y;
            })
          ) {
            if (key == "w") {
              key = "";
            }
          } else if (
            [...blocks].some((i) => {
              return i.x == x && i.y - 2 == y;
            })
          ) {
            if (key == "s") {
              key = "";
            }
          }
        }

        if (y - b.y == 1) {
          b.y -= key == "w";
        } else if (y - b.y == -1) {
          b.y += key == "s";
        }
      } else if (y == b.y) {
        if (Math.abs(x - b.x) == 1) {
          if (
            [...blocks].some((i) => {
              return i.y == y && i.x + 2 == x;
            })
          ) {
            if (key == "a") {
              key = "";
            }
          } else if (
            [...blocks].some((i) => {
              return i.y == y && i.x - 2 == x;
            })
          ) {
            if (key == "d") {
              key = "";
            }
          }
        }

        if (x - b.x == -1) {
          b.x += key == "d";
        } else if (x - b.x == 1) {
          b.x -= key == "a";
        }
      }
    } else if (b.type == "wall") {
      if (x == b.x) {
        if (y - b.y == 1) {
          if (key == "w") {
            key = "";
          }
        } else if (y - b.y == -1) {
          if (key == "s") {
            key = "";
          }
        }
      } else if (y == b.y) {
        if (x - b.x == -1) {
          if (key == "d") {
            key = "";
          }
        } else if (x - b.x == 1) {
          if (key == "a") {
            key = "";
          }
        }
      }
    } else if (b.type == "pull") {
      if (x == b.x) {
        if (y - b.y == 1) {
          b.y += key == "s";
          if (key == "w") {
            key = "";
          }
        } else if (y - b.y == -1) {
          b.y -= key == "w";
          if (key == "s") {
            key = "";
          }
        }
      } else if (y == b.y) {
        if (x - b.x == -1) {
          b.x -= key == "a";
          if (key == "d") {
            key = "";
          }
        } else if (x - b.x == 1) {
          b.x += key == "d";
          if (key == "a") {
            key = "";
          }
        }
      }
    } else if (b.type == "goal") {
      if (b.x == x && b.y == y) {
        level++;
        play(level);
      }
    }
  });

  // move
  x += (key == "d") - (key == "a");
  y += (key == "s") - (key == "w");

  // draw player
  if (deltaM == 0) {
    ctx.drawImage(neutral, x * dist, y * dist, dist, dist);
  } else {
    if (direction == "w") {
      ctx.drawImage(up, x * dist, y * dist, dist, dist);
    } else if (direction == "a") {
      ctx.drawImage(left, x * dist, y * dist, dist, dist);
    } else if (direction == "s") {
      ctx.drawImage(down, x * dist, y * dist, dist, dist);
    } else if (direction == "d") {
      ctx.drawImage(right, x * dist, y * dist, dist, dist);
    }
  }

  // draw blocks
  blocks.forEach((b) => {
    b.draw(dist);
  });

  // show level :]]]
  levelP.innerHTML = `LEVEL: ${level+1}`;

  // triggerify
  key = "";

  if (level == 4) {
    ctx.font = "20px arial"
    ctx.strokeStyle = "white"
    ctx.strokeText(`nice job, you won!`, WIDTH/2, 20)
    ctx.fillText(`nice job, you won!`, WIDTH/2, 20)
  }

  // deltaM??
  if (deltaM > 0) {
    deltaM--;
  }
}, 10);
