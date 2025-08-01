const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let score = 0;
let level = 1;
let speed = 150;

let snake = [{ x: 200, y: 200 }];
let food = randomFood();

let direction = "RIGHT";
let game;

// Stage backgrounds
const backgrounds = {
  1: "https://i.imgur.com/Qm9rC2f.jpg",      // Sand
  2: "https://i.imgur.com/Wo9IF0A.jpg",      // Jungle
  3: "https://i.imgur.com/WvQfZyp.jpg",      // Ice cave
};

// Load background
function updateBackground() {
  document.body.style.backgroundImage = `url("${backgrounds[level] || backgrounds[3]}")`;
  document.getElementById("stage").innerText = level;
}

// Random food position
function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

// Keyboard
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Touch buttons
["up", "down", "left", "right"].forEach(dir => {
  document.getElementById(dir).addEventListener("click", () => {
    const map = { up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT" };
    if (
      (map[dir] === "UP" && direction !== "DOWN") ||
      (map[dir] === "DOWN" && direction !== "UP") ||
      (map[dir] === "LEFT" && direction !== "RIGHT") ||
      (map[dir] === "RIGHT" && direction !== "LEFT")
    ) {
      direction = map[dir];
    }
  });
});

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  for (let i = 0; i < snake.length; i++) {
    const s = snake[i];
    if (i === 0) {
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(s.x, s.y, box, box);
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(s.x + 5, s.y + 5, 2, 0, 2 * Math.PI);
      ctx.arc(s.x + 15, s.y + 5, 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      const grad = ctx.createLinearGradient(s.x, s.y, s.x + box, s.y + box);
      grad.addColorStop(0, "#2e7d32");
      grad.addColorStop(1, "#1b5e20");
      ctx.fillStyle = grad;
      ctx.fillRect(s.x, s.y, box, box);
    }
  }

  // Food
  ctx.fillStyle = "#f00";
  ctx.fillRect(food.x, food.y, box, box);

  // Move
  let head = { ...snake[0] };
  if (direction === "LEFT") head.x -= box;
  if (direction === "RIGHT") head.x += box;
  if (direction === "UP") head.y -= box;
  if (direction === "DOWN") head.y += box;

  // Collision
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some((s, i) => i !== 0 && s.x === head.x && s.y === head.y)
  ) {
    clearInterval(game);
    alert(`Game Over!\nScore: ${score}\nStage: ${level}`);
    return;
  }

  snake.unshift(head);

  // Eat
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").innerText = score;
    food = randomFood();

    // Level up every 5 points
    if (score % 5 === 0) {
      level++;
      updateBackground();
      clearInterval(game);
      speed = Math.max(50, speed - 15);
      game = setInterval(draw, speed);
    }
  } else {
    snake.pop();
  }
}

// Start
updateBackground();
game = setInterval(draw, speed);
