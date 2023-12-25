import { Body, Composite } from 'matter-js';
import { IGameMatterState, ISuikaFruitBody } from '../../../interfaces';
import { settings } from '../../settings';
import { generateFruitBody } from './fruit-creation';
import { getFruitData } from './fruit-data';

export function attemptFruitMerge(
  state: IGameMatterState,
  bodyA: ISuikaFruitBody,
  bodyB: ISuikaFruitBody,
): Body | undefined {
  if (
    settings.game.enableMerge &&
    bodyA.fruitId === bodyB.fruitId &&
    !bodyA.hasMerged &&
    !bodyB.hasMerged
  ) {
    bodyA.hasMerged = true;
    bodyB.hasMerged = true;

    const midPosX = (bodyA.position.x + bodyB.position.x) / 2;
    const midPosY = (bodyA.position.y + bodyB.position.y) / 2;

    const newFruitId = bodyA.fruitId + 1;

    Composite.remove(state.world, [bodyA, bodyB]);

    const fruitData = getFruitData(newFruitId);
    if (fruitData) {
      const newFruitBody = generateFruitBody(midPosX, midPosY, newFruitId);
      Body.setAngle(newFruitBody, state.prng() * 360);

      Composite.add(state.world, newFruitBody);

      return newFruitBody;
    }
  }

  return undefined;
}
