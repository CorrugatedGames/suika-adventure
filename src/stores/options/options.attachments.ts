import { IAttachment } from '../../interfaces/store';
import { HardReset } from '../meta';

import { SetOption } from './options.actions';
import { optionsReset, setOption } from './options.functions';

export const attachments: IAttachment[] = [
  { action: HardReset, handler: optionsReset },
  { action: SetOption, handler: setOption },
];
