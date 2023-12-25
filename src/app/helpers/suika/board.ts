import {
  Bodies,
  Body,
  Composite,
  Engine,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
} from 'matter-js';
import {
  IGameMatterState,
  ISuikaFruitBody,
  PhysicsCollision,
  SuikaFruit,
  SuikaObstacle,
} from '../../../interfaces';
import { settings } from '../../settings';

export function createMatterWorld(canvas: HTMLCanvasElement) {
  const engine = Engine.create();
  const world = engine.world;

  // renderer
  const render = Render.create({
    canvas,
    engine,
    options: {
      width: settings.size.width,
      height: settings.size.height,
      ...settings.initOptions,
    },
  });

  Render.run(render);

  const runner = Runner.create();
  Runner.run(runner, engine);

  // walls
  const allBoundaries = getBoardBoundaries();
  Composite.add(world, allBoundaries);

  // add mouse control
  const mouse = Mouse.create(render.canvas);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false,
      },
    },
  });

  // keep the mouse in sync with rendering
  render.mouse = mouse;

  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: settings.size.width, y: settings.size.height },
  });

  return {
    engine,
    world,
    render,
    runner,
    mouseConstraint,
    loseBodies: allBoundaries.slice(-1),
  };
}

export function boundsForFruit(fruit: SuikaFruit) {
  const wallSize = settings.size.wallWidth / 2;
  const fruitData = settings.fruits[fruit];
  const fruitSize = fruitData.size;

  return {
    min: wallSize + fruitSize,
    max: settings.size.width - wallSize - fruitSize,
  };
}

export function getBoardBoundaries() {
  return [
    // left side
    Bodies.rectangle(
      0,
      settings.size.height / 2 + settings.size.topBuffer,
      settings.size.wallWidth,
      settings.size.height,
      {
        label: 'Border Wall',
        isStatic: true,
        render: {
          ...settings.visual.wall,
        },
        collisionFilter: {
          category: PhysicsCollision.Wall,
          mask: PhysicsCollision.Fruit,
        },
      },
    ),
    Bodies.rectangle(
      -settings.size.wallWidth,
      settings.size.height / 2,
      settings.size.wallWidth,
      settings.size.height,
      {
        label: 'Border Wall',
        isStatic: true,
        render: {
          ...settings.visual.wall,
        },
        collisionFilter: {
          category: PhysicsCollision.Wall,
          mask: PhysicsCollision.Fruit,
        },
      },
    ),

    // right side
    Bodies.rectangle(
      settings.size.width,
      settings.size.height / 2 + settings.size.topBuffer,
      settings.size.wallWidth,
      settings.size.height,
      {
        label: 'Border Wall',
        isStatic: true,
        render: {
          ...settings.visual.wall,
        },
        collisionFilter: {
          category: PhysicsCollision.Wall,
          mask: PhysicsCollision.Fruit,
        },
      },
    ),
    Bodies.rectangle(
      settings.size.width + settings.size.wallWidth,
      settings.size.height / 2,
      settings.size.wallWidth,
      settings.size.height,
      {
        label: 'Border Wall',
        isStatic: true,
        render: {
          ...settings.visual.wall,
        },
        collisionFilter: {
          category: PhysicsCollision.Wall,
          mask: PhysicsCollision.Fruit,
        },
      },
    ),

    // bottom
    Bodies.rectangle(
      settings.size.width / 2,
      settings.size.height,
      settings.size.width,
      settings.size.wallWidth,
      {
        label: 'Border Wall',
        isStatic: true,
        render: {
          ...settings.visual.wall,
        },
        collisionFilter: {
          category: PhysicsCollision.Wall,
          mask: PhysicsCollision.Fruit,
        },
      },
    ),

    // top bar
    Bodies.rectangle(
      settings.size.width / 2,
      settings.size.topBuffer,
      settings.size.width,
      1,
      {
        label: 'Lose Bar',
        isSensor: true,
        isStatic: true,
        fruitId: SuikaObstacle.DeathTouch,
        collisionFilter: {
          category: PhysicsCollision.DottedLine,
          mask: PhysicsCollision.Fruit,
        },
      } as ISuikaFruitBody,
    ),
  ];
}

export function addFruitToWorld(
  state: IGameMatterState,
  dropX: number,
  droppedFruit: Body,
) {
  Composite.add(state.world, droppedFruit);
}
