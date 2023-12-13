import { Composite } from 'matter-js';
import {
  IGameMatterState,
  ISuikaFruitBody,
  SuikaGameState,
} from '../../../interfaces';
import {
  UpdateGameLoseTimer,
  UpdateGameState,
} from '../../../stores/suika/suika.actions';
import { settings } from '../../settings';
import { getFruitData } from './fruit-data';

export function loseCheck(
  state: IGameMatterState,
  allTimeouts: Array<ReturnType<typeof setTimeout>>,
  bodyA: ISuikaFruitBody,
  bodyB: ISuikaFruitBody,
) {
  const aY = bodyA.position.y - getFruitData(bodyA.fruitId).size;
  const bY = bodyB.position.y - getFruitData(bodyB.fruitId).size;

  if (aY < settings.size.topBuffer || bY < settings.size.topBuffer) {
    let iter = 0;
    const timeouts: Array<ReturnType<typeof setTimeout>> = [];

    for (let i = 5; i >= 0; i--) {
      const timeout = setTimeout(() => {
        if (
          state.state === SuikaGameState.GameOver ||
          state.state === SuikaGameState.Restart
        )
          return;

        state.store.dispatch(new UpdateGameLoseTimer(i));

        const aY2 = bodyA.position.y - getFruitData(bodyA.fruitId).size;
        const bY2 = bodyB.position.y - getFruitData(bodyB.fruitId).size;

        if (
          aY2 < settings.size.topBuffer ||
          (bY2 < settings.size.topBuffer &&
            Composite.allBodies(state.world).includes(bodyA) &&
            Composite.allBodies(state.world).includes(bodyB))
        ) {
          if (i === 0) {
            state.store.dispatch(new UpdateGameState(SuikaGameState.GameOver));
          }
        } else {
          state.store.dispatch(new UpdateGameLoseTimer(0));

          timeouts.forEach((timeout) => clearTimeout(timeout));
          allTimeouts.forEach((timeout) => clearTimeout(timeout));
        }
      }, ++iter * 1000);

      timeouts.push(timeout);
      allTimeouts.push(timeout);
    }
  }
}
