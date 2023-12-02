
export interface ISuika {
  score: number;
  bestScore: number;
  gameState: SuikaGameState;
}

export enum SuikaGameState {
  Ready = 'ready',
  Dropping = 'dropping',
  GameOver = 'gameOver'
}
