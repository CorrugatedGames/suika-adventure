import { IAttachment } from '../../interfaces/store';
import { HardReset } from '../meta';
import {
  SetGameId,
  UpdateBestScore,
  UpdateCurrentFruit,
  UpdateGameLoseTimer,
  UpdateGameState,
  UpdateNextFruit,
  UpdateScore,
} from './suika.actions';
import {
  setGameId,
  suikaReset,
  updateBestScore,
  updateCurrentFruit,
  updateGameLoseTimer,
  updateGameState,
  updateNextFruit,
  updateScore,
} from './suika.functions';

export const attachments: IAttachment[] = [
  { action: HardReset, handler: suikaReset },
  { action: SetGameId, handler: setGameId },
  { action: UpdateScore, handler: updateScore },
  { action: UpdateBestScore, handler: updateBestScore },
  { action: UpdateGameState, handler: updateGameState },
  { action: UpdateCurrentFruit, handler: updateCurrentFruit },
  { action: UpdateNextFruit, handler: updateNextFruit },
  { action: UpdateGameLoseTimer, handler: updateGameLoseTimer },
];
