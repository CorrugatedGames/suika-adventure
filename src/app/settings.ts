import { SuikaFruit } from '../interfaces';

export const settings = {
  initOptions: {
    wireframes: false,
    background: 'transparent',
  },
  visual: {
    wall: {
      fillStyle: '#aaa',
      strokeStyle: '#aaa',
      lineWidth: 1,
    },
  },
  size: {
    dropOffset: 96,
    topBuffer: 160,
    wallWidth: 32,
    width: 650,
    height: 800,
  },
  game: {
    enableMerge: true,
    renderCustomShapes: false,
  },
  fruits: {
    [SuikaFruit.Cherry]: {
      fruitId: 'cherry',
      color: '#de3f70',
      size: 20,
      score: 1,
      chances: 10,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
    [SuikaFruit.Strawberry]: {
      fruitId: 'strawberry',
      color: '#ef4b27',
      size: 30,
      score: 3,
      chances: 8,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
    [SuikaFruit.Grape]: {
      fruitId: 'grape',
      color: '#de72f9',
      size: 40,
      score: 6,
      chances: 31,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
    [SuikaFruit.Clementine]: {
      fruitId: 'clementine',
      color: '#ffaa41',
      size: 60,
      score: 4,
      chances: 1,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
    [SuikaFruit.Orange]: {
      fruitId: 'orange',
      color: '#e58b52',
      size: 80,
      score: 11,
      chances: 1,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
    [SuikaFruit.Pomegranate]: {
      fruitId: 'pomegranate',
      color: '#fd303b',
      size: 100,
      score: 18,
      chances: 0,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
    [SuikaFruit.Lemon]: {
      fruitId: 'lemon',
      color: '#f6e664',
      size: 120,
      score: 29,
      chances: 0,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
    [SuikaFruit.Peach]: {
      fruitId: 'peach',
      color: '#fe97f8',
      size: 140,
      score: 47,
      chances: 0,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
    [SuikaFruit.Pineapple]: {
      fruitId: 'pineapple',
      color: '#f3eb14',
      size: 160,
      score: 76,
      chances: 0,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
    [SuikaFruit.Cantaloupe]: {
      fruitId: 'cantaloupe',
      color: '#c5ff5c',
      size: 180,
      score: 123,
      chances: 0,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
    [SuikaFruit.Watermelon]: {
      fruitId: 'watermelon',
      color: '#38b704',
      size: 200,
      score: 199,
      chances: 0,
      physics: {
        density: 0.1,
        restitution: 0.006,
        friction: 0.006,
        frictionAir: 0.006,
        frictionStatic: 0.006,
      },
    },
  },
};
