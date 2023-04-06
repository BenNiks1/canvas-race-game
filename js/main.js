const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 720;

let speed = 3;
let score = 0;
let gameOver = false;

class Background {
  constructor(image, speed) {
    this.image = new Image();
    this.image.src = image;
    this.x = 0;
    this.y = 0;
    this.speed = speed;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, canvas.width, canvas.height);
    ctx.drawImage(
      this.image,
      this.x,
      this.y - canvas.height,
      canvas.width,
      canvas.height
    );
  }

  update() {
    this.y += this.speed;
    if (this.y > canvas.height) {
      this.y = 0;
    }
  }
}

class Player {
  constructor(x, y, width, height,image ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
this.image = image
  }

  draw() {
    // хитбокс
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height);


    const image = new Image()
    image.src = this.image

    ctx.drawImage(image, this.x, this.y, this.width, this.height);

  }

  update() {
    if (keys.ArrowUp && this.y > 0) {
      this.y -= speed;
    }

    if (keys.ArrowDown && this.y < canvas.height - this.height) {
      this.y += speed;
    }

    if (keys.ArrowLeft && this.x > 0) {
      this.x -= speed;
    }

    if (keys.ArrowRight && this.x < canvas.width - this.width) {
      this.x += speed;
    }

    canvas.addEventListener('touchstart', (e) => {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;

      if (touchY < this.y && this.y > 0) {
        this.y -= speed;
      }

      if (touchY > this.y + this.height && this.y < canvas.height - this.height) {
        this.y += speed;
      }

      if (touchX < this.x && this.x > 0) {
        this.x -= speed;
      }

      if (touchX > this.x + this.width && this.x < canvas.width - this.width) {
        this.x += speed;
      }
    });
  }

  carIntersect(obstacle) {
    return (
      this.x < obstacle.x + obstacle.width &&
      this.x + this.width > obstacle.x &&
      this.y < obstacle.y + obstacle.height &&
      this.y + this.height > obstacle.y
    );
  }
}

class Obstacle {
  constructor(x, y, speed, image, width, height) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.image = image;
    this.width = width || 50;
    this.height = height || 100;
  }

  draw() {
    // хитбокс
    ctx.fillStyle = 'black';
    ctx.fillRect(this.x, this.y, this.width, this.height);


    const image = new Image()
    image.src = this.image

    ctx.drawImage(image, this.x, this.y, this.width, this.height);


  }

    update() {
      // движение
      this.y += this.speed;

      // Проверка на коллизии с другими машинами-препятствиями и изменение скорости
      for (let obstacle of obstacles) {
        if (obstacle !== this && this.carIntersect(obstacle)) {
          const distance = Math.abs(this.y - obstacle.y);
          if (this.speed > obstacle.speed) {
            this.speed -= 0.2 * (1 - distance / this.height);
          } else {
            this.speed += 0.2 * (1 - distance / this.height);
          }
        }
      }

      // если препятствие выходит за пределы холста, создаем новое
      if (this.y > canvas.height) {
        this.y = -200; // отображение за верхней границей
        this.x = Math.random() * (canvas.width - this.width); // случайная позиция по горизонтали
        this.speed = speed / (Math.random() * 3 + 1); // случайная скорость
      }

      // коллизия с игроком
      if (player.carIntersect(this)) {
        gameOver = true;
      }
    }

  carIntersect(otherCar) {
    return (
      this.x < otherCar.x + otherCar.width &&
      this.x + this.width > otherCar.x &&
      this.y < otherCar.y + otherCar.height &&
      this.y + this.height > otherCar.y
    );
  }
}

class Coin {
  constructor(x, y, width, height, image) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.speed = speed;
  }

  draw() {
    const image = new Image()
    image.src = this.image

    ctx.drawImage(image, this.x, this.y, this.width, this.height);

  }

  update() {
    this.y += this.speed;

    if (this.y > canvas.height) {
      let newX, colliding;

      do {
        newX = Math.random() * (canvas.width - this.width);
        colliding = coins.some((coin) => isColliding(this, coin, newX, this.y - canvas.height));
      } while (colliding);

      this.x = newX;
      this.y = -200;
    }
  }

  playerCoinIntersect(player) {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }
}

function isColliding(obj1, obj2, newX, newY) {
  return (
    newX < obj2.x + obj2.width &&
    newX + obj1.width > obj2.x &&
    newY < obj2.y + obj2.height &&
    newY + obj1.height > obj2.y
  );
}

const player = new Player(160, 500, 50, 100,'./img/player.png' );

const background = new Background("./img/road.png", speed);

const obstaclesImage = ['./img/car1.png','./img/car3.png','./img/car2.png']
const coinImage = './img/coin.png'

const obstacles = [
  new Obstacle(Math.random() * (canvas.width - 50), -200, speed / 2, obstaclesImage[0]),
  new Obstacle(Math.random() * (canvas.width - 50), -400, speed / 3, obstaclesImage[1]),
  new Obstacle(
    Math.random() * (canvas.width - 50),
    -600,
    speed / 2.5,
    obstaclesImage[2]
  ),
];

const coins = [
  new Coin(Math.random() * (canvas.width - 50), -100, 30, 30, coinImage),
  new Coin(Math.random() * (canvas.width - 50), -300, 30, 30, coinImage),
  new Coin(Math.random() * (canvas.width - 50), -500, 30, 30, coinImage),
];

let coinsCollected = 0;

const keys = {};

document.addEventListener("keydown", (event) => {
  keys[event.code] = true;
});

document.addEventListener("keyup", (event) => {
  keys[event.code] = false;
});

function showScore() {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function showCoinsCollected() {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Coins: ${coinsCollected}`, 220, 30);
}

function showGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
  ctx.font = "24px Arial";
  ctx.fillText("Press 'R' to restart", canvas.width / 2 - 70, canvas.height / 2 + 40);
}

function restartGame(event) {
  if (gameOver && event.code === "KeyR") {
    gameOver = false;
    score = 0;
    coinsCollected = 0;
    player.x = 160;
    player.y = 500;

    for (const obstacle of obstacles) {
      obstacle.y = -Math.random() * canvas.height;
    }

    for (const coin of coins) {
      coin.y = -Math.random() * canvas.height;
    }
  }
}

document.addEventListener("keydown", restartGame);

function animate() {
  if (!gameOver) {
    background.update();
    background.draw();

    for (const obstacle of obstacles) {
      obstacle.update();
      obstacle.draw();
    }

    for (const coin of coins) {
      coin.update();
      coin.draw();
      if (coin.playerCoinIntersect(player)) {
        coinsCollected += 1;
        coin.y = -Math.random() * canvas.height;
        coin.x = Math.random() * (canvas.width - coin.width);
      }
    }

    player.update();
    player.draw();

    showScore();
    showCoinsCollected();

    score += 1;
  } else {
    showGameOver();
  }

  requestAnimationFrame(animate);
}

animate();
