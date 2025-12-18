// prevent default space scroll
window.addEventListener("keydown", function (e) {
  if (e.code === " ") e.preventDefault();
});

window.addEventListener("load", function () {
  let gameStarted = false;
  let gameOver = false;

  const canvas = document.getElementById("canvasid");
  const ctx = canvas.getContext("2d");
  canvas.width = 500;
  canvas.height = 500;

  // ====== Button Class ======
  class Button {
    constructor(x, y, width, height, text, onClick) {
      this.x = x;
      this.y = y;
      this.image = playButton;
      this.width = width;
      this.height = height;
      this.text = text;
      this.onClick = onClick;
    }

    draw(ctx) {
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        this.text,
        this.x + this.width / 2,
        this.y + this.height / 2
      );

      // Debug: draw clickable area outline
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }

    isClicked(mouseX, mouseY) {
      return (
        mouseX >= this.x &&
        mouseX <= this.x + this.width &&
        mouseY >= this.y &&
        mouseY <= this.y + this.height
      );
    }
  }

  // ====== Input Handler ======
  class InputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (e) => {
        if (e.key === " " && !this.keys.includes(" ")) {
          this.keys.push(" ");
        }
      });
      window.addEventListener("keyup", (e) => {
        if (e.key === " ") this.keys.splice(this.keys.indexOf(" "), 1);
      });
    }
  }

  // ====== Player ======

  class Player {
    constructor(game, image) {
      this.game = game;
      this.width = 100;
      this.height = 91.3;
      this.x = 0;
      this.y = this.game.height - this.height;
      this.velocityY = 0;
      this.gravity = 0.5;
      this.jumpPower = -15;
      this.groundY = this.game.height - this.height;
      this.image = image;
      this.input = new InputHandler();

      // sprite animation
      this.frameX = 0;
      this.framesetY = 0;
      this.maxFrame = 3;
      this.frameTimer = 0;
      this.frameInterval = 10;
    }

    update() {
      const onGround = this.y >= this.groundY;
      if (this.input.keys.includes(" ") && onGround) {
        this.velocityY = this.jumpPower;
      }

      this.velocityY += this.gravity;
      this.y += this.velocityY;

      if (onGround) {
        this.framesetY = 3;
      } else {
        if (this.velocityY > 0) {
          this.framesetY = 2;
        } else {
          this.framesetY = 1;
        }
      }

      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.velocityY = 0;
      }

      // sprite animation
      this.frameX += 0.15;
      if (this.frameX > 6) this.frameX = 0;
    }

    draw(ctx) {
      ctx.drawImage(
        this.image,
        Math.floor(this.frameX) * this.width,
        this.framesetY * this.height,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
  }

  // ====== Obstacle ======
  class Obstacle {
    constructor(game) {
      this.game = game;
      this.width = 100;
      this.height = 100;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.speed = 7;
      this.scalingX = 1;
      this.scalingY = 1;
    }

    update() {
      this.x -= this.speed;
      if (this.x + this.width < 0) {
        this.x = this.game.width;
        this.scalingY = Math.random() * (2 - 1) + 1;
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
      ctx.scale(this.scalingX, this.scalingY);
      ctx.fillStyle = "red";
      ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
      //ctx.clip;
      ctx.restore();
    }
  }

  // ====== Sun ======
  class Sun {
    constructor(game) {
      this.game = game;
      this.radius = 30;
      this.x = 50;
      this.y = 50;
      this.speed = 0.5; // horizontal
    }

    update() {
      // movement loop
      this.x += this.speed;
      if (this.x - this.radius > this.game.width) {
        this.x = -this.radius;
      }
    }

    draw(ctx) {
      ctx.save();

      ctx.beginPath();
      ctx.rect(0, 0, this.game.width, 100);
      ctx.clip();

      ctx.fillStyle = "yellow";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // ====== Game ======
  class Game {
    constructor(width, height) {
      this.sun = new Sun(this);
      this.width = width;
      this.height = height;
      this.player = new Player(this, player); // player sprite element
      this.obstacle = new Obstacle(this);
    }

    update() {
      this.sun.update();
      this.player.update();
      this.obstacle.update();

      // collision
      if (
        this.player.x < this.obstacle.x + this.obstacle.width &&
        this.player.x + this.player.width > this.obstacle.x &&
        this.player.y < this.obstacle.y + this.obstacle.height &&
        this.player.y + this.player.height > this.obstacle.y
      ) {
        gameOver = true;
      }
    }

    draw(ctx) {
      this.sun.draw(ctx);
      this.player.draw(ctx);
      this.obstacle.draw(ctx);
    }

    reset() {
      this.player.x = 0;
      this.player.y = this.height - this.player.height;
      this.player.velocityY = 0;
      this.player.frameX = 0;
      this.obstacle.x = this.width;
      this.obstacle.scalingX = 1;
      this.obstacle.scalingY = 1;
      gameOver = false;
      requestAnimationFrame(animate);
    }
  }

  // ====== Start Button ======
  const playButtonInstance = new Button(190, 225, 120, 50, "PLAY", startGame);

  canvas.addEventListener("click", (e) => {
    // to know scaling ratio for clickarea
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    if (!gameStarted && playButtonInstance.isClicked(mouseX, mouseY)) {
      startGame();
    }
  });

  // ====== Game Init ======
  const game = new Game(canvas.width, canvas.height);

  function startGame() {
    if (!gameStarted) {
      gameStarted = true;
      requestAnimationFrame(animate);
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gameStarted) {
      playButtonInstance.draw(ctx);
      return;
    }

    if (!gameOver) {
      game.update();
      game.draw(ctx);
      requestAnimationFrame(animate);
    } else {
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("GAME OVER", canvas.width / 2, 200);
      ctx.font = "20px Arial";
      ctx.fillText("Press Enter to Restart", canvas.width / 2, 260);
    }
  }

  // ====== Restart on Enter ======
  window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      if (gameOver) {
        game.reset();
      } else if (!gameStarted) {
        startGame();
      }
    }
  });

  animate();
});
