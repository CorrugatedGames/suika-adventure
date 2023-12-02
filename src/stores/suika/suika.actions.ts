import { SuikaGameState } from '../../interfaces';

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
