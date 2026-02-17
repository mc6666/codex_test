export const GRID_SIZE = 10;
export const INITIAL_DIRECTION = "right";
export const DIRECTIONS = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 }
};

function pointKey(point) {
  return `${point.x},${point.y}`;
}

function isOpposite(a, b) {
  return (
    (a === "up" && b === "down") ||
    (a === "down" && b === "up") ||
    (a === "left" && b === "right") ||
    (a === "right" && b === "left")
  );
}

export function createInitialState(gridSize = GRID_SIZE, rng = Math.random) {
  const center = Math.floor(gridSize / 2);
  const snake = [{ x: center, y: center }];
  return {
    gridSize,
    snake,
    direction: INITIAL_DIRECTION,
    food: spawnFood(gridSize, snake, rng),
    score: 0,
    status: "running"
  };
}

export function spawnFood(gridSize, snake, rng = Math.random) {
  const occupied = new Set(snake.map(pointKey));
  const freeCells = [];
  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      if (!occupied.has(`${x},${y}`)) {
        freeCells.push({ x, y });
      }
    }
  }
  if (freeCells.length === 0) {
    return null;
  }
  const index = Math.floor(rng() * freeCells.length);
  return freeCells[index];
}

function getNextDirection(current, requested, snakeLength) {
  if (!requested || !DIRECTIONS[requested]) {
    return current;
  }
  if (snakeLength > 1 && isOpposite(current, requested)) {
    return current;
  }
  return requested;
}

function inBounds(head, gridSize) {
  return head.x >= 0 && head.y >= 0 && head.x < gridSize && head.y < gridSize;
}

function collidesWithBody(head, snake, ateFood) {
  const body = ateFood ? snake : snake.slice(0, snake.length - 1);
  return body.some((segment) => segment.x === head.x && segment.y === head.y);
}

export function step(state, requestedDirection, rng = Math.random) {
  if (state.status !== "running") {
    return state;
  }

  const direction = getNextDirection(
    state.direction,
    requestedDirection,
    state.snake.length
  );
  const delta = DIRECTIONS[direction];
  const currentHead = state.snake[state.snake.length - 1];
  const nextHead = { x: currentHead.x + delta.x, y: currentHead.y + delta.y };
  const ateFood =
    state.food !== null &&
    nextHead.x === state.food.x &&
    nextHead.y === state.food.y;

  if (!inBounds(nextHead, state.gridSize) || collidesWithBody(nextHead, state.snake, ateFood)) {
    return {
      ...state,
      direction,
      status: "gameOver"
    };
  }

  const nextSnake = [...state.snake, nextHead];
  if (!ateFood) {
    nextSnake.shift();
  }

  const nextFood = ateFood ? spawnFood(state.gridSize, nextSnake, rng) : state.food;
  const nextStatus = nextFood === null ? "gameOver" : "running";

  return {
    ...state,
    snake: nextSnake,
    direction,
    food: nextFood,
    score: state.score + (ateFood ? 1 : 0),
    status: nextStatus
  };
}
