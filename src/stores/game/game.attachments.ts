import { IAttachment } from '../../interfaces/store';
import { UpdateFirebaseUID } from './game.actions';
import { setFirebaseUID } from './game.functions';


export const attachments: IAttachment[] = [
  { action: UpdateFirebaseUID, handler: setFirebaseUID }
];
