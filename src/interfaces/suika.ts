import type { Store } from '@ngxs/store';
import type { Engine, Render, Runner, World } from 'matter-js';

export interface ISuika {
  uuid: string;

  gameState: SuikaGameState;

  gameLoseTimer: number;

  score: number;
  bestScore: number;

  currentFruit: SuikaFruit;
  nextFruit: SuikaFruit;
}

export enum SuikaObstacle {
  DeathTouch = -1,
}

export enum SuikaFruit {
  Cherry = 1,
  Strawberry = 2,
  Grape = 3,
  Clementine = 4,
  Orange = 5,
  Pomegranate = 6,
  Lemon = 7,
  Peach = 8,
  Pineapple = 9,
  Cantaloupe = 10,
  Watermelon = 11,
}

export enum SuikaGameState {
  Ready = 'ready',
  Dropping = 'dropping',
  GameOver = 'gameOver',
  Restart = 'restart',
}

export interface ISuikaFruitBody extends Matter.Body {
  fruitId: SuikaFruit | SuikaObstacle;
  hasMerged: boolean;
}

export enum PhysicsCollision {
  Wall = 0x0001,
  Fruit = 0x0002,
  Preview = 0x0004,
  DottedLine = 0x0008,
}

export interface IGameMatterState {
  store: Store;
  state: SuikaGameState;
  engine: Engine;
  world: World;
  render: Render;
  runner: Runner;
  prng: () => number;
}
