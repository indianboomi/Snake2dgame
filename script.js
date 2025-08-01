const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;

let snake = [
  { x: 200, y: 200 },
];
let food = spawnFood();
let direction = "RIGHT";
let score = 0;

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

function spawnFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = "#00FF00";
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#00FF00";
  ctx.fillRect(food.x, food.y, box, box);

  // Move
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Wall or self collision
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some((s, i) => i !== 0 && s.x === head.x && s.y === head.y)
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
    food = spawnFood();
  } else {
    snake.pop();
  }
}

// Start game
let game = setInterval(draw, 150);
