export interface ISuika {
  gameState: SuikaGameState;

  score: number;
  bestScore: number;

  currentFruit: SuikaFruit;
  nextFruit: SuikaFruit;
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
}

export interface ISuikaFruitBody extends Matter.Body {
  fruitId: SuikaFruit;
}
