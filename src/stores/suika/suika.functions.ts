import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { ISuika, SuikaGameState } from '../../interfaces/suika';
import { UpdateBestScore, UpdateGameState, UpdateScore } from './suika.actions';

export const defaultSuika: () => ISuika = () => ({
  version: 0,
  score: 0,
  bestScore: 0,
  gameState: SuikaGameState.Ready
});

export function updateScore(ctx: StateContext<ISuika>, { newScore }: UpdateScore) {
  ctx.setState(patch<ISuika>({
    score: newScore
  }));
}

export function updateBestScore(ctx: StateContext<ISuika>, { newScore }: UpdateBestScore) {
  ctx.setState(patch<ISuika>({
    bestScore: newScore
  }));
}

export function updateGameState(ctx: StateContext<ISuika>, { newGameState }: UpdateGameState) {
  ctx.setState(patch<ISuika>({
    gameState: newGameState
  }));
}
