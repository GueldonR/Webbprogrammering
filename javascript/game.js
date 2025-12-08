document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("playButton").addEventListener("click", function () {
    startGame();
  });
});

var ctx;
var c;
var x = 0;
var objects = [];

// init av spelet
function startGame() {
  c = document.getElementById("canvasid");
  ctx = c.getContext("2d");

  objects.push(new componentFactory(30, 30, "red", 10, 120, 1, 0));

  redraw();

  // hur ofta vi kör spelloopen
  window.setInterval(gameLoop, 30);
}

// händelseförloppet
function gameLoop() {
  // timerfunktion

  for (obj in objects) {
    obj.update();
  }
}

// Redraw screen
function redraw() {
  ctx.clearRect(0, 0, c.width, c.height);

  for (obj in objects) {
    obj.frame();
  }
  window.requestAnimationFrame(redraw);
}

// klass för att skapa komponenter
class componentFactory {
  constructor(width, height, color, x, y, speedX, speedY) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.color = color;

    this.speedX = speedX;
    this.speedY = speedY;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  frame() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rectangle(0, 0, this.width, this.height);
    ctx.restore();
  }
}

// 3 objekt: bakgrund, sprite(spelare), pipe
