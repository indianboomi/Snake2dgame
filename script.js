const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let score = 0;

// Start with 1 block snake
let snake = [{ x: 200, y: 200 }];
let food = spawnFood();
let direction = "RIGHT";

// Beep sound (retro tone)
const beep = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");

// Keyboard control
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Touch controls
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

// Create random food on grid
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
  for (let part of snake) {
    ctx.fillRect(part.x, part.y, box, box);
  }

  // Draw food
  ctx.fillStyle = "#00BFFF";
  ctx.fillRect(food.x, food.y, box, box);

  // Move snake head
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // ✅ Wrap around screen (borderless mode)
  if (head.x < 0) head.x = canvas.width - box;
  if (head.x >= canvas.width) head.x = 0;
  if (head.y < 0) head.y = canvas.height - box;
  if (head.y >= canvas.height) head.y = 0;

  // Self collision
  if (snake.some((s, i) => i !== 0 && s.x === head.x && s.y === head.y)) {
    clearInterval(game);
    alert("💀 Game Over! Your Score: " + score);
    return;
  }

  snake.unshift(head);

  // Food eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    beep.currentTime = 0;
    beep.play(); // 🔊 Retro beep
    food = spawnFood();
  } else {
    snake.pop();
  }
}

// Start game
const game = setInterval(draw, 150);
