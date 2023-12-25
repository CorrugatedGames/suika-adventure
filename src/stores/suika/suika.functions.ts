import { StateContext } from '@ngxs/store';
import { patch } from '@ngxs/store/operators';
import { ISuika, SuikaFruit, SuikaGameState } from '../../interfaces/suika';
import {
  SetGameId,
  UpdateBestScore,
  UpdateCurrentFruit,
  UpdateGameLoseTimer,
  UpdateGameState,
  UpdateNextFruit,
  UpdateScore,
} from './suika.actions';

export const defaultSuika: () => ISuika = () => ({
  version: 0,
  uuid: '',
  score: 0,
  bestScore: 0,
  gameLoseTimer: 0,
  gameState: SuikaGameState.Ready,
  currentFruit: SuikaFruit.Cherry,
  nextFruit: SuikaFruit.Cherry,
});

export function suikaReset(ctx: StateContext<ISuika>) {
  ctx.setState(defaultSuika());
}

export function setGameId(ctx: StateContext<ISuika>, { newId }: SetGameId) {
  ctx.setState(
    patch<ISuika>({
      uuid: newId,
    }),
  );
}

export function updateScore(
  ctx: StateContext<ISuika>,
  { newScore }: UpdateScore,
) {
  const currentScore = ctx.getState().score;

  ctx.setState(
    patch<ISuika>({
      score: currentScore + newScore,
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
  const patchState: Partial<ISuika> = {
    gameState: newGameState,
  };

  if (newGameState === SuikaGameState.GameOver) {
    const score = ctx.getState().score;
    const previousBestScore = ctx.getState().bestScore;

    if (score > previousBestScore) {
      patchState.bestScore = score;
    }
  }

  if (newGameState === SuikaGameState.Restart) {
    patchState.currentFruit = SuikaFruit.Cherry;
    patchState.nextFruit = SuikaFruit.Cherry;
    patchState.score = 0;
    patchState.gameLoseTimer = 0;
  }

  ctx.setState(patch<ISuika>(patchState));
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

export function updateGameLoseTimer(
  ctx: StateContext<ISuika>,
  { newTimer }: UpdateGameLoseTimer,
) {
  const { gameLoseTimer, gameState } = ctx.getState();
  if (
    gameState === SuikaGameState.GameOver ||
    (gameLoseTimer > 0 && newTimer >= gameLoseTimer)
  )
    return;

  ctx.setState(
    patch<ISuika>({
      gameLoseTimer: newTimer,
    }),
  );
}
