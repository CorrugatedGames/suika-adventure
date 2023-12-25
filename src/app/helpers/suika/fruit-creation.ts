import { uniqBy } from 'lodash';
import { Bodies, Vertices } from 'matter-js';
import {
  IGameMatterState,
  ISuikaFruitBody,
  PhysicsCollision,
  SuikaFruit,
} from '../../../interfaces';
import { settings } from '../../settings';
import { getFruitData, getFruitPhysics } from './fruit-data';

export function getRandomDroppableFruit(state: IGameMatterState): SuikaFruit {
  const droppableFruits = Object.keys(settings.fruits)
    .map((fruitId) => {
      const fruitData = settings.fruits[+fruitId as SuikaFruit];
      return Array(fruitData.chances).fill(fruitId);
    })
    .flat()
    .filter(Boolean);

  return +droppableFruits[Math.floor(state.prng() * droppableFruits.length)];
}

export function generateFruitBody(
  x: number,
  y: number,
  suikaFruit: SuikaFruit,
  extraOpts = {},
) {
  if (!suikaFruit) {
    throw new Error(`Cannot generate invalid suika fruit ${suikaFruit}`);
  }

  const fruitData = getFruitData(suikaFruit);
  const fruitPhysicsData = getFruitPhysics(suikaFruit);

  const physicsProperties = {
    restitution: fruitPhysicsData.restitution,
    density: fruitPhysicsData.density,
    friction: fruitPhysicsData.friction,
    frictionAir: fruitPhysicsData.frictionAir,
    frictionStatic: fruitPhysicsData.frictionStatic,
  };

  if (!fruitData || !fruitPhysicsData) {
    throw new Error(`Cannot get data or physics for ${suikaFruit}`);
  }

  const otherBodyProps = {
    collisionFilter: {
      category: PhysicsCollision.Fruit,
      mask:
        PhysicsCollision.Wall |
        PhysicsCollision.Fruit |
        PhysicsCollision.DottedLine,
    },
    fruitId: suikaFruit,
    ...physicsProperties,
    ...extraOpts,
  };

  let body: Matter.Body;

  if (settings.game.renderCustomShapes) {
    const vertices = Vertices.clockwiseSort(
      uniqBy(
        fruitPhysicsData.fixtures[0].vertices.flat(),
        (vert: { x: number; y: number }) => `${vert.x},${vert.y}`,
      ),
    );

    body = Bodies.fromVertices(
      x,
      y,
      [vertices],
      {
        render: {
          sprite: {
            texture: `assets/fruit/images/${fruitData.fruitId}.png`,
            xScale: 1,
            yScale: 1,
          },
        },
        ...otherBodyProps,
      } as Partial<ISuikaFruitBody>,
      true,
      0.1,
      5,
      0.1,
    );
  } else {
    body = Bodies.circle(x, y, fruitData.size, {
      render: {
        sprite: {
          texture: `assets/fruit/images-circular/${fruitData.fruitId}.png`,
          xScale: 1,
          yScale: 1,
        },
        fillStyle: fruitData.color,
      },
      ...otherBodyProps,
    });
  }

  if (!body) {
    throw new Error(`Cannot generate body for suika fruit ${suikaFruit}`);
  }

  return body;
}

export function generatePreviewFruitBody(
  lastMousePosition: number,
  currentFruit: SuikaFruit,
) {
  return generateFruitBody(
    lastMousePosition,
    settings.size.dropOffset,
    currentFruit,
    {
      isStatic: true,
      collisionFilter: {
        category: PhysicsCollision.Preview,
        mask: 0,
      },
    },
  );
}
