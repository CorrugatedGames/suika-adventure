import { IAttachment } from '../../interfaces/store';
import { HardReset } from '../meta';
import { UpdateFirebaseUID } from './game.actions';
import { gameReset, setFirebaseUID } from './game.functions';

export const attachments: IAttachment[] = [
  { action: HardReset, handler: gameReset },
  { action: UpdateFirebaseUID, handler: setFirebaseUID },
];
