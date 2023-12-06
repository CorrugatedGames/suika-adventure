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
  friction: {
    base: 0.006,
    static: 0.006,
    air: 0.006,
    restitution: 0.1,
  },
  size: {
    dropOffset: 48,
    topBuffer: 160,
    wallWidth: 32,
    width: 800,
    height: 928,
  },
  fruits: {
    [SuikaFruit.Cherry]: {
      fruitId: 'cherry',
      size: 20,
      score: 1,
      chances: 10,
    },
    [SuikaFruit.Strawberry]: {
      fruitId: 'strawberry',
      size: 30,
      score: 3,
      chances: 8,
    },
    [SuikaFruit.Grape]: {
      fruitId: 'grape',
      size: 40,
      score: 4,
      chances: 6,
    },
    [SuikaFruit.Clementine]: {
      fruitId: 'clementine',
      size: 60,
      score: 7,
      chances: 3,
    },
    [SuikaFruit.Orange]: {
      fruitId: 'orange',
      size: 80,
      score: 11,
      chances: 1,
    },
    [SuikaFruit.Pomegranate]: {
      fruitId: 'pomegranate',
      size: 100,
      score: 18,
      chances: 0,
    },
    [SuikaFruit.Lemon]: {
      fruitId: 'lemon',
      size: 120,
      score: 29,
      chances: 0,
    },
    [SuikaFruit.Peach]: {
      fruitId: 'peach',
      size: 140,
      score: 47,
      chances: 0,
    },
    [SuikaFruit.Pineapple]: {
      fruitId: 'pineapple',
      size: 160,
      score: 76,
      chances: 0,
    },
    [SuikaFruit.Cantaloupe]: {
      fruitId: 'cantaloupe',
      size: 180,
      score: 123,
      chances: 0,
    },
    [SuikaFruit.Watermelon]: {
      fruitId: 'watermelon',
      size: 200,
      score: 199,
      chances: 0,
    },
  },
};
