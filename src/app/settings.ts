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
    dropOffset: 48,
    topBuffer: 160,
    wallWidth: 32,
    width: 800,
    height: 928,
  },
  game: {
    enableMerge: true,
  },
  fruits: {
    [SuikaFruit.Cherry]: {
      fruitId: 'cherry',
      size: 20,
      score: 1,
      chances: 1,
    },
    [SuikaFruit.Strawberry]: {
      fruitId: 'strawberry',
      size: 30,
      score: 3,
      chances: 1,
    },
    [SuikaFruit.Grape]: {
      fruitId: 'grape',
      size: 40,
      score: 4,
      chances: 31,
    },
    [SuikaFruit.Clementine]: {
      fruitId: 'clementine',
      size: 60,
      score: 7,
      chances: 1,
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
      chances: 1,
    },
    [SuikaFruit.Lemon]: {
      fruitId: 'lemon',
      size: 120,
      score: 29,
      chances: 1,
    },
    [SuikaFruit.Peach]: {
      fruitId: 'peach',
      size: 140,
      score: 47,
      chances: 1,
    },
    [SuikaFruit.Pineapple]: {
      fruitId: 'pineapple',
      size: 160,
      score: 76,
      chances: 1,
    },
    [SuikaFruit.Cantaloupe]: {
      fruitId: 'cantaloupe',
      size: 180,
      score: 123,
      chances: 1,
    },
    [SuikaFruit.Watermelon]: {
      fruitId: 'watermelon',
      size: 200,
      score: 199,
      chances: 1,
    },
  },
};
