window.addEventListener("load", function () {
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }
    update() {}
    draw() {}
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 100;
      this.height = 91.3;
      this.x = 0;
      this.y = 100;
    }
    update() {}
    draw(context) {
      context.fillrect(this.x, this.y, this.width, this.height);
    }
  }
  game = new Game();
  console.log(game);
});
