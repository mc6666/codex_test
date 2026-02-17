import { GRID_SIZE, createInitialState, step } from "./snakeLogic.js";

const DEFAULT_TICK_MS = 300;
const board = document.getElementById("board");
const scoreEl = document.getElementById("score");
const statusEl = document.getElementById("status");
const pauseBtn = document.getElementById("pause");
const restartBtn = document.getElementById("restart");
const touchButtons = document.querySelectorAll("[data-dir]");
const speedInput = document.getElementById("speed");
const speedValue = document.getElementById("speed-value");

const cells = [];
for (let i = 0; i < GRID_SIZE * GRID_SIZE; i += 1) {
  const cell = document.createElement("div");
  cell.className = "cell";
  board.appendChild(cell);
  cells.push(cell);
}

let state = createInitialState();
let queuedDirection = state.direction;
let paused = false;
let tickMs = DEFAULT_TICK_MS;
let timerId = null;

function toIndex(point) {
  return point.y * GRID_SIZE + point.x;
}

function render() {
  for (const cell of cells) {
    cell.className = "cell";
  }

  for (const segment of state.snake) {
    cells[toIndex(segment)].classList.add("snake");
  }

  if (state.food) {
    cells[toIndex(state.food)].classList.add("food");
  }

  scoreEl.textContent = String(state.score);
  if (state.status === "gameOver") {
    statusEl.textContent = "Game over";
  } else if (paused) {
    statusEl.textContent = "Paused";
  } else {
    statusEl.textContent = "Running";
  }
}

function tick() {
  if (paused || state.status === "gameOver") {
    return;
  }
  state = step(state, queuedDirection);
  render();
}

function setDirection(direction) {
  queuedDirection = direction;
}

function restart() {
  state = createInitialState();
  queuedDirection = state.direction;
  paused = false;
  pauseBtn.textContent = "Pause";
  render();
}

function startTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
  }
  timerId = setInterval(tick, tickMs);
}

window.addEventListener("keydown", (event) => {
  const map = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    s: "down",
    a: "left",
    d: "right",
    W: "up",
    S: "down",
    A: "left",
    D: "right"
  };
  const direction = map[event.key];
  if (direction) {
    event.preventDefault();
    setDirection(direction);
  }
});

for (const button of touchButtons) {
  button.addEventListener("click", () => {
    const direction = button.getAttribute("data-dir");
    if (direction) {
      setDirection(direction);
    }
  });
}

pauseBtn.addEventListener("click", () => {
  if (state.status === "gameOver") {
    return;
  }
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  render();
});

restartBtn.addEventListener("click", restart);

speedInput.addEventListener("input", () => {
  tickMs = Number(speedInput.value);
  speedValue.textContent = `${tickMs}ms`;
  startTimer();
});

speedInput.value = String(DEFAULT_TICK_MS);
speedValue.textContent = `${DEFAULT_TICK_MS}ms`;
startTimer();
render();
