import test from "node:test";
import assert from "node:assert/strict";
import { createInitialState, spawnFood, step } from "../src/snakeLogic.js";

test("moves one cell per tick in current direction", () => {
  const state = {
    gridSize: 8,
    snake: [{ x: 3, y: 3 }],
    direction: "right",
    food: { x: 0, y: 0 },
    score: 0,
    status: "running"
  };

  const next = step(state, null, () => 0);
  assert.deepEqual(next.snake, [{ x: 4, y: 3 }]);
  assert.equal(next.status, "running");
});

test("blocks opposite direction when snake length > 1", () => {
  const state = {
    gridSize: 8,
    snake: [
      { x: 2, y: 3 },
      { x: 3, y: 3 }
    ],
    direction: "right",
    food: { x: 0, y: 0 },
    score: 0,
    status: "running"
  };

  const next = step(state, "left", () => 0);
  assert.equal(next.direction, "right");
  assert.deepEqual(next.snake, [
    { x: 3, y: 3 },
    { x: 4, y: 3 }
  ]);
});

test("eating food grows snake and increases score", () => {
  const state = {
    gridSize: 8,
    snake: [{ x: 3, y: 3 }],
    direction: "right",
    food: { x: 4, y: 3 },
    score: 0,
    status: "running"
  };

  const next = step(state, "right", () => 0);
  assert.equal(next.score, 1);
  assert.equal(next.snake.length, 2);
  assert.deepEqual(next.snake[1], { x: 4, y: 3 });
});

test("wall collision causes game over", () => {
  const state = {
    gridSize: 5,
    snake: [{ x: 4, y: 2 }],
    direction: "right",
    food: { x: 0, y: 0 },
    score: 0,
    status: "running"
  };

  const next = step(state, "right", () => 0);
  assert.equal(next.status, "gameOver");
});

test("food spawn never overlaps snake", () => {
  const snake = [{ x: 0, y: 0 }];
  const food = spawnFood(2, snake, () => 0);
  assert.notDeepEqual(food, { x: 0, y: 0 });
});

test("initial state sets score and running status", () => {
  const state = createInitialState(10, () => 0);
  assert.equal(state.score, 0);
  assert.equal(state.status, "running");
  assert.equal(state.snake.length, 1);
});
