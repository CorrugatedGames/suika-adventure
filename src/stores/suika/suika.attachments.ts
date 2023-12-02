import { IAttachment } from '../../interfaces/store';
import { UpdateBestScore, UpdateGameState, UpdateScore } from './suika.actions';
import { updateBestScore, updateGameState, updateScore } from './suika.functions';


export const attachments: IAttachment[] = [
  { action: UpdateScore, handler: updateScore },
  { action: UpdateBestScore, handler: updateBestScore },
  { action: UpdateGameState, handler: updateGameState }
];
