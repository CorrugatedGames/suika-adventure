import { StateContext } from '@ngxs/store';

import { GameOption, IOptions } from '../../interfaces';
import { SetOption } from './options.actions';

export const defaultOptions: () => IOptions = () => ({
  version: 0,
  [GameOption.DebugMode]: false,
  [GameOption.ColorTheme]: 'suikaadventure',
  [GameOption.SoundMaster]: 50,
  [GameOption.SoundSFX]: 100,
  [GameOption.TelemetryErrors]: true,
  [GameOption.TelemetrySavefiles]: true,
});

export function optionsReset(ctx: StateContext<IOptions>) {
  ctx.setState(defaultOptions());
}

export function setOption(
  ctx: StateContext<IOptions>,
  { option, value }: SetOption,
) {
  ctx.patchState({ [option]: value });
}
