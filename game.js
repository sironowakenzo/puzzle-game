const SIZE = 5;

const TILES = [
  { id: "forest", name: "森", icon: "🌲" },
  { id: "town", name: "町", icon: "🏠" },
  { id: "river", name: "川", icon: "💧" }
];

let board = [];
let score = 0;
let highScore = 0;
let nextTile = null;
let gameEnded = false;

const boardEl = document.getElementById("board");
const scoreEl = document.getElementById("score");
const highScoreEl = document.getElementById("highScore");
const nextTileEl = document.getElementById("nextTile");
const gameOverEl = document.getElementById("gameOver");
const finalScoreEl = document.getElementById("finalScore");
const restartBtn = document.getElementById("restartBtn");
const restartBtn2 = document.getElementById("restartBtn2");

function randomTile() {
  return TILES[Math.floor(Math.random() * TILES.length)];
}

function initGame() {
  board = Array.from({ length: SIZE }, () => Array(SIZE).fill(null));
  score = 0;
  highScore = Number(localStorage.getItem("tile_high_score") || 0);
  nextTile = randomTile();
  gameEnded = false;
  render();
}

function render() {
  scoreEl.textContent = score;
  highScoreEl.textContent = highScore;

  nextTileEl.className = `next-tile ${nextTile.id}`;
  nextTileEl.textContent = nextTile.icon;

  boardEl.innerHTML = "";

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("button");
      cell.classList.add("cell");

      const value = board[y][x];

      if (value === null) {
        cell.classList.add("empty");
        cell.textContent = "";
        cell.disabled = gameEnded;
        cell.addEventListener("click", () => placeTile(x, y));
      } else {
        const tile = TILES.find(t => t.id === value);
        cell.classList.add(tile.id);
        cell.textContent = tile.icon;
        cell.disabled = true;
      }

      boardEl.appendChild(cell);
    }
  }

  if (gameEnded) {
    finalScoreEl.textContent = score;
    gameOverEl.classList.remove("hidden");
  } else {
    gameOverEl.classList.add("hidden");
  }
}

function placeTile(x, y) {
  if (gameEnded) return;
  if (board[y][x] !== null) return;

  board[y][x] = nextTile.id;

  const neighbors = countSameNeighbors(x, y, nextTile.id);
  score += calcScore(neighbors);

  if (score > highScore) {
    highScore = score;
    localStorage.setItem("tile_high_score", String(highScore));
  }

  if (isBoardFull()) {
    gameEnded = true;
  } else {
    nextTile = randomTile();
  }

  render();
}

function countSameNeighbors(x, y, type) {
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1]
  ];

  let count = 0;

  for (const [dx, dy] of dirs) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx < 0 || nx >= SIZE || ny < 0 || ny >= SIZE) continue;
    if (board[ny][nx] === type) count++;
  }

  return count;
}

function calcScore(neighborCount) {
  if (neighborCount === 0) return 1;
  if (neighborCount === 1) return 3;
  if (neighborCount === 2) return 5;
  return 8;
}

function isBoardFull() {
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (board[y][x] === null) return false;
    }
  }
  return true;
}

restartBtn.addEventListener("click", initGame);
restartBtn2.addEventListener("click", initGame);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js");
  });
}

initGame();
