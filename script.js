const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let score = 0;

// Snake starts with one block in the center
let snake = [
  { x: 200, y: 200 }
];

// First food position
let food = spawnFood();

// Start direction
let direction = "RIGHT";

// Handle keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Handle touch button input
["up", "down", "left", "right"].forEach((dir) => {
  document.getElementById(dir).addEventListener("click", () => {
    const map = { up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT" };
    const newDir = map[dir];

    if (
      (newDir === "LEFT" && direction !== "RIGHT") ||
      (newDir === "RIGHT" && direction !== "LEFT") ||
      (newDir === "UP" && direction !== "DOWN") ||
      (newDir === "DOWN" && direction !== "UP")
    ) {
      direction = newDir;
    }
  });
});

// Generate random food on grid
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / box)) * box,
    y: Math.floor(Math.random() * (canvas.height / box)) * box,
  };
}

// Game loop
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = "#00FF00";
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#00BFFF";
  ctx.fillRect(food.x, food.y, box, box);

  // Move the snake
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Check collision with wall or self
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some((s, i) => i !== 0 && s.x === head.x && s.y === head.y)
  ) {
    clearInterval(game);
    alert("💀 Game Over! Your Score: " + score);
    return;
  }

  snake.unshift(head);

  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = spawnFood();
  } else {
    snake.pop();
  }
}

// Start game loop
const game = setInterval(draw, 150);
