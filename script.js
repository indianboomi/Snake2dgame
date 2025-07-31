const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let score = 0;

let snake = [{ x: 200, y: 200 }];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};

let direction = "RIGHT";
let newDirection = direction;

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") newDirection = "LEFT";
  else if (event.key === "ArrowUp" && direction !== "DOWN") newDirection = "UP";
  else if (event.key === "ArrowRight" && direction !== "LEFT") newDirection = "RIGHT";
  else if (event.key === "ArrowDown" && direction !== "UP") newDirection = "DOWN";
});

function setDirection(dir) {
  if (
    (dir === "LEFT" && direction !== "RIGHT") ||
    (dir === "RIGHT" && direction !== "LEFT") ||
    (dir === "UP" && direction !== "DOWN") ||
    (dir === "DOWN" && direction !== "UP")
  ) {
    newDirection = dir;
  }
}

function draw() {
  direction = newDirection;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? "#0f0" : "#0b0";
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Game over
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(game);
    alert("Game Over! Score: " + score);
    return;
  }

  snake.unshift(head);

  // Eat food
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = {
      x: Math.floor(Math.random() * 20) * box,
      y: Math.floor(Math.random() * 20) * box,
    };
  } else {
    snake.pop();
  }
}

let game = setInterval(draw, 150);
