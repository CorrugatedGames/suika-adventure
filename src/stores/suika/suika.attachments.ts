import { IAttachment } from '../../interfaces/store';
import {
  UpdateBestScore,
  UpdateCurrentFruit,
  UpdateGameState,
  UpdateNextFruit,
  UpdateScore,
} from './suika.actions';
import {
  updateBestScore,
  updateCurrentFruit,
  updateGameState,
  updateNextFruit,
  updateScore,
} from './suika.functions';

export const attachments: IAttachment[] = [
  { action: UpdateScore, handler: updateScore },
  { action: UpdateBestScore, handler: updateBestScore },
  { action: UpdateGameState, handler: updateGameState },
  { action: UpdateCurrentFruit, handler: updateCurrentFruit },
  { action: UpdateNextFruit, handler: updateNextFruit },
];
