import { SuikaFruit } from '../../../../interfaces';

export const settings = {
  initOptions: {
    wireframes: true,
    background: 'transparent',
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
      size: 20,
      score: 1,
      chances: 10,
    },
    [SuikaFruit.Strawberry]: {
      size: 30,
      score: 3,
      chances: 8,
    },
    [SuikaFruit.Grape]: {
      size: 40,
      score: 4,
      chances: 6,
    },
    [SuikaFruit.Clementine]: {
      size: 60,
      score: 7,
      chances: 3,
    },
    [SuikaFruit.Orange]: {
      size: 80,
      score: 11,
      chances: 1,
    },
    [SuikaFruit.Pomegranate]: {
      size: 100,
      score: 18,
      chances: 0,
    },
    [SuikaFruit.Lemon]: {
      size: 120,
      score: 29,
      chances: 0,
    },
    [SuikaFruit.Peach]: {
      size: 140,
      score: 47,
      chances: 0,
    },
    [SuikaFruit.Pineapple]: {
      size: 160,
      score: 76,
      chances: 0,
    },
    [SuikaFruit.Cantaloupe]: {
      size: 180,
      score: 123,
      chances: 0,
    },
    [SuikaFruit.Watermelon]: {
      size: 200,
      score: 199,
      chances: 0,
    },
  },
};
