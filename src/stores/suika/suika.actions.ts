import { SuikaFruit, SuikaGameState } from '../../interfaces';

export class SetGameId {
  static type = '[GameState] Set Id';
  constructor(public newId: string) {}
}

export class UpdateScore {
  static type = '[Score] Update Current';
  constructor(public newScore: number) {}
}

export class UpdateBestScore {
  static type = '[Score] Update Best';
  constructor(public newScore: number) {}
}

export class UpdateGameState {
  static type = '[GameState] Update';
  constructor(public newGameState: SuikaGameState) {}
}

export class UpdateCurrentFruit {
  static type = '[GameState] Update Current Fruit';
  constructor(public newFruit: SuikaFruit) {}
}

export class UpdateNextFruit {
  static type = '[GameState] Update Next Fruit';
  constructor(public newFruit: SuikaFruit) {}
}

export class UpdateGameLoseTimer {
  static type = '[GameState] Update Lose Timer';
  constructor(public newTimer: number) {}
}
