import fruitPhysics from '../../../assets/fruit/physics/fruit.json';
import { SuikaFruit } from '../../../interfaces';
import { settings } from '../../settings';

export function getFruitData(fruit: SuikaFruit) {
  return settings.fruits[fruit];
}

export function getFruitPhysics(fruit: SuikaFruit) {
  const data = getFruitData(fruit);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (fruitPhysics as any)[data.fruitId];
}
