const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const box = 20;
let score = 0;
let level = 1;
let speed = 150;

let snake = [
  { x: 200, y: 200 },         // Head
  { x: 180, y: 200 },         // Tail 1
  { x: 160, y: 200 }          // Tail 2
];

let food = randomFood();
let direction = "RIGHT";
let game;

// Stage backgrounds
const backgrounds = {
  1: "https://i.imgur.com/Qm9rC2f.jpg",      // Sand
  2: "https://i.imgur.com/Wo9IF0A.jpg",      // Jungle
  3: "https://i.imgur.com/WvQfZyp.jpg",      // Ice cave
};

function updateBackground() {
  document.body.style.backgroundImage = `url("${backgrounds[level] || backgrounds[3]}")`;
  document.getElementById("stage").innerText = level;
}

function randomFood() {
  return {
    x: Math.floor(Math.random() * 20) * box,
    y: Math.floor(Math.random() * 20) * box,
  };
}

// Keyboard controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Touch controls for Android
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
      // Head
      ctx.fillStyle = "#4CAF50";
      ctx.beginPath();
      ctx.arc(s.x + box / 2, s.y + box / 2, box / 2, 0, Math.PI * 2);
      ctx.fill();

      // Eyes
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.arc(s.x + 6, s.y + 6, 2, 0, 2 * Math.PI);
      ctx.arc(s.x + 14, s.y + 6, 2, 0, 2 * Math.PI);
      ctx.fill();
    } else {
      // Rounded tail
      ctx.fillStyle = "#2e7d32";
      ctx.beginPath();
      ctx.arc(s.x + box / 2, s.y + box / 2, box / 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw blue food
  ctx.fillStyle = "#00BFFF";
  ctx.beginPath();
  ctx.arc(food.x + box / 2, food.y + box / 2, box / 2.5, 0, 2 * Math.PI);
  ctx.fill();

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
    alert(`Game Over!\nScore: ${score}\nStage: ${level}`);
    return;
  }

  snake.unshift(head);

  // Eat food
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
