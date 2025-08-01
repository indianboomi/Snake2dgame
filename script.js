const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let score = 0;

// Initial snake and food
let snake = [{ x: 200, y: 200 }];
let food = {
  x: Math.floor(Math.random() * 20) * box,
  y: Math.floor(Math.random() * 20) * box,
};

// Movement direction
let direction = "RIGHT";

// Keyboard controls
document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Touch controls for Android
document.getElementById("up").addEventListener("click", () => {
  if (direction !== "DOWN") direction = "UP";
});
document.getElementById("down").addEventListener("click", () => {
  if (direction !== "UP") direction = "DOWN";
});
document.getElementById("left").addEventListener("click", () => {
  if (direction !== "RIGHT") direction = "LEFT";
});
document.getElementById("right").addEventListener("click", () => {
  if (direction !== "LEFT") direction = "RIGHT";
});

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    const s = snake[i];
    if (i === 0) {
      // Head
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(s.x, s.y, box, box);

      // Eyes
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(s.x + 5, s.y + 5, 2, 0, 2 * Math.PI); // Left eye
      ctx.arc(s.x + 15, s.y + 5, 2, 0, 2 * Math.PI); // Right eye
      ctx.fill();
    } else {
      // Body with gradient
      const grad = ctx.createLinearGradient(s.x, s.y, s.x + box, s.y + box);
      grad.addColorStop(0, "#2e7d32");
      grad.addColorStop(1, "#1b5e20");
      ctx.fillStyle = grad;
      ctx.fillRect(s.x, s.y, box, box);
    }
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

  // Collision check
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

  // Check if snake eats food
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

// Start game
const game = setInterval(draw, 150);
