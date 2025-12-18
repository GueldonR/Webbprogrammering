// prevent default space scroll
window.addEventListener("keydown", function (e) {
  if (e.code === " ") e.preventDefault();
});

window.addEventListener("load", function () {
  let gameStarted = false;
  let gameOver = false;
  let animationTime = 0;

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

      // // Debug: draw clickable area outline
      // ctx.strokeStyle = "red";
      // ctx.lineWidth = 2;
      // ctx.strokeRect(this.x, this.y, this.width, this.height);
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

  // ====== Score Keeping ======
  class ScoreKeeping {
    constructor(game) {
      this.game = game;
      this.score = 0;
      this.x = 20;
      this.y = 30;
    }
    update() {
      if (!gameOver) {
        this.score++;
      }
    }
    draw(ctx) {
      ctx.fillStyle = "black";
      ctx.font = "20px Arial";
      ctx.textAlign = "left";
      ctx.fillText("Score: " + this.score, this.x, this.y);
    }
  }

  // ====== Player =====/

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
      this.baseWidth = 100;
      this.baseHeight = 100;
      this.width = this.baseWidth;
      this.height = this.baseHeight;
      this.x = this.game.width;
      this.y = this.game.height - this.height;
      this.speed = 7;
      this.minScaleY = 0.5;
      this.maxScaleY = 1.2;
    }

    update() {
      this.x -= this.speed;

      if (this.x + this.width < 0) {
        this.x = this.game.width;

        const scaleY =
          Math.random() * (this.maxScaleY - this.minScaleY) + this.minScaleY;

        // scale obstacle
        this.height = this.baseHeight * scaleY;

        // update groundedness
        this.y = this.game.height - this.height;

        // var speed
        this.speed += (Math.random() - 0.5) * 0.5;
        this.speed = Math.max(0.2, this.speed);
      }
    }

    draw(ctx) {
      ctx.save();
      ctx.fillStyle = "red";
      ctx.fillRect(this.x, this.y, this.width, this.height);
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
      this.speed = 0.5;
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

      // Hierarkiska transformationer (VG-krav)
      ctx.translate(this.x, this.y);
      ctx.rotate(animationTime * 0.01);

      // Gradient (VG-krav)
      const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
      g.addColorStop(0, "#ffff00");
      g.addColorStop(1, "#ff6600");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // Eclipse
  class Eclipse extends Sun {
    constructor(game) {
      super(game);
      this.speed = 2;
    }

    draw(ctx) {
      // Animerad klippning (G-krav)
      const eclipseRadius = this.radius + Math.sin(animationTime * 0.1) * 5;

      ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, eclipseRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ====== Game ======
  class Game {
    constructor(width, height) {
      this.sun = new Sun(this);
      this.eclipse = new Eclipse(this);
      this.width = width;
      this.height = height;
      this.player = new Player(this, player); // player sprite element
      this.obstacle = new Obstacle(this);
      this.scoreKeeping = new ScoreKeeping(this);
    }

    update() {
      this.sun.update();
      this.eclipse.update();
      this.player.update();
      this.obstacle.update();

      if (
        this.sun.x > this.eclipse.x - this.eclipse.radius &&
        this.sun.x < this.eclipse.x + this.eclipse.radius
      ) {
        canvas.style.backgroundColor = "darkblue";
      } else {
        canvas.style.backgroundColor = "lightblue";
      }
      // collision
      if (
        this.player.x < this.obstacle.x + this.obstacle.width &&
        this.player.x + this.player.width > this.obstacle.x &&
        this.player.y < this.obstacle.y + this.obstacle.height &&
        this.player.y + this.player.height > this.obstacle.y
      ) {
        gameOver = true;
      } else {
        this.scoreKeeping.update();
      }
    }

    draw(ctx) {
      this.sun.draw(ctx);
      this.eclipse.draw(ctx);
      this.player.draw(ctx);
      this.obstacle.draw(ctx);
      this.scoreKeeping.draw(ctx);
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
    console.log(rect);
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
    animationTime++;
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
      // Game Over Screen
      const scorekeeping = game.scoreKeeping;
      scorekeeping.draw(ctx);
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
