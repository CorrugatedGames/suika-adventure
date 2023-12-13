import fruitPhysics from '../../../assets/fruit/physics/fruit.json';
import { SuikaFruit } from '../../../interfaces';
import { settings } from '../../settings';

export function getFruitData(fruit: SuikaFruit) {
  return settings.fruits[fruit];
}

export function getFruitPhysics(fruit: SuikaFruit) {
  const data = getFruitData(fruit);

  if (!settings.game.renderCustomShapes) {
    return (
      data.physics ?? {
        density: 0.1,
        restitution: 0.01,
        friction: 0.01,
        frictionAir: 0.01,
        frictionStatic: 0.01,
      }
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (fruitPhysics as any)[data.fruitId]
  );
}
