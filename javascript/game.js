document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("playButton").addEventListener("click", function () {
    startGame();
  });
});

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
  }
}
