const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const tileW = WIDTH / 10;
const tileH = HEIGHT / 10;

const mouse = new Map([
    ["click", 0],
    ["x", 0],
    ["y", 0]
]);

class block {
    constructor(x, y, type, level, color) {
        this.x = x; this.y = y;
        this.type = type; this.level = level;
        this.color = color;
    }

    draw(context) {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, tileW, tileH);
    }
}

const grid = new Set();

canvas.addEventListener("mousedown", (e) => {
    mouse.set("click", 1);
    mouse.set("x", e.offsetX);
    mouse.set("y", e.offsetY);
});

let rah = 0;

setInterval(() => {
    
    if (mouse.get("click")) {
        rah = Math.floor(Math.random() * 8);
        grid.add(new block(
            Math.floor(mouse.get("x") / tileW) * tileW,
            Math.floor(mouse.get("y") / tileH) * tileH,
            "red",
            "10",
            ["red","orange","yellow","green","aqua","blue","purple","pink"][rah]
        ));
    }

    grid.forEach((i) => {
        i.draw(ctx);
    });

    mouse.set("click", 0);
}, 10);