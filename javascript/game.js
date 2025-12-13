// prevent default
window.addEventListener("keydown", function (e) {
  if (e.code === " ") {
    e.preventDefault()
  }
})
// game logic
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
      this.obstacle = new Obstacle(this);
      this.player.x; 
      this.player.y;
      this.player.width;
      this.player.height;
      this.obstacle.x; 
      this.obstacle.y;
      this.obstacle.width;
      this.obstacle.height;
    }
    update() {
      this.player.update();
      this.obstacle.update();

      if (
        this.player.x < this.obstacle.x + this.obstacle.width &&
        this.player.x + this.player.width > this.obstacle.x &&
        this.player.y < this.obstacle.y + this.obstacle.height &&
        this.player.y + this.player.height > this.obstacle.y
      ) {
        console.log("collision");
        // what happens if player and obst collide
        gameOver = true; 
      }
    }
    draw(context) {
      this.player.draw(context);
      this.obstacle.draw(context)
    }
  }

  class Player {
    constructor(game) {
      this.game = game;
      this.width = 100;
      this.height = 91.3;
      this.x = 0;
      this.y = this.game.height - this.height;
      this.image = player; //  id selection of the sprite
      this.input = new inputHandler();
      this.velocityY = 0;
      this.gravity = 0.5;
      this.jumpPower = -15;
      this.groundY = this.game.height - this.height;
    }
    update() {
      // Check if on ground
      const onGround = this.y >= this.groundY;
      
      // Jump when space is pressed and on ground
      if (this.input.keys.includes(" ") && onGround) {
        this.velocityY = this.jumpPower;
      }
      
      // Gravity
      this.velocityY += this.gravity;
      
      // Update position
      this.y += this.velocityY;
      
      // Stop falling when hitting ground
      if (this.y >= this.groundY) {
        this.y = this.groundY;
        this.velocityY = 0;
      }
    }
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

  class Obstacle {
    
    constructor(game) {
      this.game = game;
      this.width = 100;
      this.height = 100;
      this.x = this.game.width;
      this.groundX = this.game.width - this.width;
      this.y = this.game.height - this.height;
      this.speed = 7;
    }
  
    update() {
      const outOfCanvas = this.x + this.width < 0
      this.x -= this.speed
      // reset when going out of frame 
      if (outOfCanvas) {
        this.x = this.groundX;
      }
    }
  
    draw(context) {
      context.save()
      context.fillStyle = "red"
      context.fillRect(this.x, this.y, this.width, this.height)
      context.restore()
    }
  }

  class inputHandler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", (keyevent) => {
      // Logs space bar press and release
        if (
          (keyevent.key === " ") &&
          this.keys.indexOf(keyevent.key) === -1
        ) {
          this.keys.push(keyevent.key);
        }
        console.log(keyevent.key, this.keys);
      });
      window.addEventListener("keyup", (keyevent) => {
        if (keyevent.key === " ") {
          this.keys.splice(this.keys.indexOf(keyevent.key), 1);
        }
        console.log(keyevent.key, this.keys);
      });
    }
  }

  // game init
  const game = new Game(canvas.width, canvas.height);
  game.draw(ctx);
  console.log(game);
  let gameOver = false;

  function animate(bool) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!gameOver){
      game.update();
      game.draw(ctx);
      requestAnimationFrame(animate(bool));
    }
    else {
      ctx.fillStyle = "black";
      ctx.font = "30px Arial";
      ctx.fillText("GAME OVER", canvas.width / 2 - 80, canvas.height / 2);
    }
   
  }
  animate();
});
