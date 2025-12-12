window.addEventListener("load", function () {
  const canvas = document.getElementById("canvasid");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.player = new Player(this);
    }
    update() {
      this.player.update();
    }
    draw(context) {
      this.player.draw(context);
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 100;
      this.height = 91.3;
      this.x = 0;
      this.y = this.game.height - this.height;
      this.image = player;
      this.input = new inputHandler();
    }
    update() {}
    draw(context) {
      context.drawImage(
        this.image,
        0,
        0,
        this.width,
        this.height,
        this.x,
        this.y,
        this.height,
        this.width
      );
    }
  }

  class inputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (keyevent) => {
        if (
          (keyevent.key === "ArrowDown" || keyevent.key === "ArrowUp") &&
          this.keys.indexOf(keyevent.key) === -1
        ) {
          this.keys.push(keyevent.key);
        }
        console.log(keyevent.key, this.keys);
      });
      window.addEventListener("keyup", (keyevent) => {
        if (keyevent.key === "ArrowDown" || keyevent.key === "ArrowUp") {
          this.keys.splice(this.keys.indexOf(keyevent.key), 1);
        }
        console.log(keyevent.key, this.keys);
      });
    }
  }

  const game = new Game(canvas.width, canvas.height);
  game.draw(ctx);
  console.log(game);

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update();
    game.draw(ctx);
    requestAnimationFrame(animate);
  }
  animate();
});
