import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { ISuika, SuikaFruit, SuikaGameState } from '../../interfaces/suika';
import {
  UpdateBestScore,
  UpdateCurrentFruit,
  UpdateGameState,
  UpdateNextFruit,
  UpdateScore,
} from './suika.actions';

export const defaultSuika: () => ISuika = () => ({
  version: 0,
  score: 0,
  bestScore: 0,
  gameState: SuikaGameState.Ready,
  currentFruit: SuikaFruit.Cherry,
  nextFruit: SuikaFruit.Cherry,
});

export function updateScore(
  ctx: StateContext<ISuika>,
  { newScore }: UpdateScore,
) {
  ctx.setState(
    patch<ISuika>({
      score: newScore,
    }),
  );
}

export function updateBestScore(
  ctx: StateContext<ISuika>,
  { newScore }: UpdateBestScore,
) {
  ctx.setState(
    patch<ISuika>({
      bestScore: newScore,
    }),
  );
}

export function updateGameState(
  ctx: StateContext<ISuika>,
  { newGameState }: UpdateGameState,
) {
  ctx.setState(
    patch<ISuika>({
      gameState: newGameState,
    }),
  );
}

export function updateCurrentFruit(
  ctx: StateContext<ISuika>,
  { newFruit }: UpdateCurrentFruit,
) {
  ctx.setState(
    patch<ISuika>({
      currentFruit: newFruit,
    }),
  );
}

export function updateNextFruit(
  ctx: StateContext<ISuika>,
  { newFruit }: UpdateNextFruit,
) {
  ctx.setState(
    patch<ISuika>({
      nextFruit: newFruit,
    }),
  );
}
