import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Select, Store } from '@ngxs/store';
import {
  Bodies,
  Body,
  Composite,
  Engine,
  Events,
  Mouse,
  MouseConstraint,
  Render,
  Runner,
  World,
} from 'matter-js';
import { Observable, combineLatest } from 'rxjs';
import {
  ISuikaFruitBody,
  SuikaFruit,
  SuikaGameState,
} from '../../../../interfaces';
import { SuikaState } from '../../../../stores';
import {
  UpdateCurrentFruit,
  UpdateGameLoseTimer,
  UpdateGameState,
  UpdateNextFruit,
  UpdateScore,
} from '../../../../stores/suika/suika.actions';
import { settings } from '../../../settings';

import seedrandom from 'seedrandom';
import {
  getFruitData,
  getFruitPhysics,
} from '../../../helpers/suika/fruit-data';

/*
TODO:
- adjust all hitboxes
- random direction for merged fruit
- refactor suika game to a bunch of anon functions, etc
- create game by uuid, store uuid in suika state
*/

@Component({
  selector: 'app-suika-game',
  templateUrl: './suika-game.component.html',
  styleUrl: './suika-game.component.scss',
})
export class SuikaGameComponent implements OnInit {
  @ViewChild('suikaAdventure', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Select(SuikaState.state) state$!: Observable<SuikaGameState>;
  @Select(SuikaState.currentFruit) currentFruit$!: Observable<SuikaFruit>;
  @Select(SuikaState.nextFruit) nextFruit$!: Observable<SuikaFruit>;

  private isInit = false;
  private allTimeouts: Array<ReturnType<typeof setTimeout>> = [];

  private lastMousePosition = 0;

  private currentState: SuikaGameState = SuikaGameState.Ready;

  private engine!: Engine;
  private world!: World;
  private render!: Render;
  private runner!: Runner;

  private currentFruit: SuikaFruit = SuikaFruit.Cherry;
  private nextFruit: SuikaFruit = SuikaFruit.Cherry;
  private previewBody: Matter.Body | null = null;

  private prng = seedrandom('seed');

  constructor(private store: Store) {}

  ngOnInit() {
    document.body.addEventListener(
      'contextmenu',
      (event) => {
        event.preventDefault();
        event.stopPropagation();
        return false;
      },
      false,
    );

    combineLatest([this.state$, this.currentFruit$, this.nextFruit$]).subscribe(
      ([state, currentFruit, nextFruit]) => {
        if (state === SuikaGameState.Restart) {
          this.isInit = false;
          this.previewBody = null;

          World.clear(this.world, false);
          Engine.clear(this.engine);
          Render.stop(this.render);
          Runner.stop(this.runner);

          this.store.dispatch(new UpdateGameState(SuikaGameState.Ready));
          return;
        }

        this.currentState = state;
        this.currentFruit = currentFruit ?? SuikaFruit.Cherry;
        this.nextFruit = nextFruit ?? SuikaFruit.Cherry;

        if (!this.isInit) {
          this.isInit = true;
          this.initGame();
        }
      },
    );
  }

  private initGame() {
    this.canvasRef.nativeElement.width = settings.size.width;
    this.canvasRef.nativeElement.height = settings.size.height;

    this.engine = Engine.create();
    this.world = this.engine.world;

    // renderer
    this.render = Render.create({
      canvas: this.canvasRef.nativeElement,
      engine: this.engine,
      options: {
        width: settings.size.width,
        height: settings.size.height,
        ...settings.initOptions,
      },
    });

    Render.run(this.render);

    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);

    // walls
    Composite.add(this.world, [
      // left side
      Bodies.rectangle(
        0,
        settings.size.height / 2 + settings.size.topBuffer,
        settings.size.wallWidth,
        settings.size.height,
        {
          isStatic: true,
          render: {
            ...settings.visual.wall,
          },
        },
      ),
      Bodies.rectangle(
        -settings.size.wallWidth,
        settings.size.height / 2,
        settings.size.wallWidth,
        settings.size.height,
        {
          isStatic: true,
          render: {
            ...settings.visual.wall,
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
          isStatic: true,
          render: {
            ...settings.visual.wall,
          },
        },
      ),
      Bodies.rectangle(
        settings.size.width + settings.size.wallWidth,
        settings.size.height / 2,
        settings.size.wallWidth,
        settings.size.height,
        {
          isStatic: true,
          render: {
            ...settings.visual.wall,
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
          isStatic: true,
          render: {
            ...settings.visual.wall,
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
          isSensor: false,
          isStatic: true,
          collisionFilter: {
            mask: 0,
          },
        },
      ),
    ]);

    // collision events
    Events.on(this.engine, 'collisionStart', (e) => {
      for (let i = 0; i < e.pairs.length; i++) {
        const { bodyA, bodyB } = e.pairs[i];
        this.bodyCollision(bodyA as ISuikaFruitBody, bodyB as ISuikaFruitBody);
      }
    });

    // add mouse control
    const mouse = Mouse.create(this.render.canvas);
    const mouseConstraint = MouseConstraint.create(this.engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    this.render.mouse = mouse;

    Events.on(mouseConstraint, 'mouseup', () => {
      this.addCurrentFruit(this.lastMousePosition);
    });

    Events.on(mouseConstraint, 'mousemove', (e) => {
      if (this.currentState !== SuikaGameState.Ready || !this.previewBody)
        return;

      this.ensureFruitIsInBounds(e.mouse.position.x);
    });

    // keep the mouse in sync with rendering
    this.render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(this.render, {
      min: { x: 0, y: 0 },
      max: { x: settings.size.width, y: settings.size.height },
    });

    // generate the first two fruits
    this.cycleFruits();
  }

  // update the preview fruit position
  private updateFruitPosition() {
    if (!this.previewBody) return;

    Body.set(this.previewBody, 'position', {
      x: this.lastMousePosition,
      y: settings.size.dropOffset,
    });
  }

  // ensure the current fruit display is in bounds
  private ensureFruitIsInBounds(positionX: number) {
    const { min, max } = this.boundsForFruit(this.currentFruit);
    const clampedX = Math.max(min, Math.min(max, positionX));
    this.lastMousePosition = clampedX;

    this.updateFruitPosition();
  }

  // get the current fruit boundaries
  private boundsForFruit(fruit: SuikaFruit) {
    const wallSize = settings.size.wallWidth / 2;
    const fruitData = settings.fruits[fruit];
    const fruitSize = fruitData.size;

    return {
      min: wallSize + fruitSize,
      max: settings.size.width - wallSize - fruitSize,
    };
  }

  // switch to the next fruit and generate a new one
  private cycleFruits() {
    const newFruit = this.getRandomDroppableFruit();

    this.store.dispatch([
      new UpdateCurrentFruit(this.nextFruit),
      new UpdateNextFruit(newFruit),
      new UpdateGameState(SuikaGameState.Ready),
    ]);

    this.createNewPreviewBody();
  }

  // place the current fruit in the scene
  private addCurrentFruit(dropX: number) {
    if (!this.previewBody) return;

    Composite.remove(this.world, this.previewBody);
    this.previewBody = null;

    this.store.dispatch(new UpdateGameState(SuikaGameState.Dropping));

    const droppedFruit = this.generateFruitBody(
      dropX,
      settings.size.dropOffset,
      this.currentFruit,
    );

    Composite.add(this.world, droppedFruit);

    setTimeout(() => {
      this.cycleFruits();
    }, 200);
  }

  // get a random droppable fruit based on settings
  private getRandomDroppableFruit(): SuikaFruit {
    const droppableFruits = Object.keys(settings.fruits)
      .map((fruitId) => {
        const fruitData = settings.fruits[+fruitId as SuikaFruit];
        return Array(fruitData.chances).fill(fruitId);
      })
      .flat()
      .filter(Boolean);

    return +droppableFruits[Math.floor(this.prng() * droppableFruits.length)];
  }

  // create a new preview fruit
  private createNewPreviewBody() {
    if (this.previewBody) return;

    this.previewBody = this.generateFruitBody(
      this.lastMousePosition,
      settings.size.dropOffset,
      this.currentFruit,
      {
        isStatic: true,
        collisionFilter: { mask: 0x0040 },
      },
    );

    this.ensureFruitIsInBounds(this.lastMousePosition);

    Composite.add(this.world, this.previewBody);
  }

  // get a fruit body
  private generateFruitBody(
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

    if (!fruitData || !fruitPhysicsData) {
      throw new Error(`Cannot get data or physics for ${suikaFruit}`);
    }

    const vertices = fruitPhysicsData.fixtures[0].vertices.flat();

    const body = Bodies.fromVertices(
      x,
      y,
      [vertices],
      {
        ...settings.friction,
        ...extraOpts,
        render: {
          sprite: {
            texture: `assets/fruit/images/${fruitData.fruitId}.png`,
            xScale: 1,
            yScale: 1,
          },
        },
      },
      true,
    );

    if (!body) {
      throw new Error(`Cannot generate body for suika fruit ${suikaFruit}`);
    }

    (body as ISuikaFruitBody).fruitId = suikaFruit;

    return body;
  }

  // two bodies collide, but it's just two fruits usually
  private bodyCollision(bodyA: ISuikaFruitBody, bodyB: ISuikaFruitBody) {
    if (bodyA.isStatic || bodyB.isStatic || !bodyA.fruitId || !bodyB.fruitId)
      return;

    const aY = bodyA.position.y - getFruitData(bodyA.fruitId).size;
    const bY = bodyB.position.y - getFruitData(bodyB.fruitId).size;

    // check if we lose
    if (aY < settings.size.topBuffer || bY < settings.size.topBuffer) {
      let iter = 0;
      const timeouts: Array<ReturnType<typeof setTimeout>> = [];

      for (let i = 5; i >= 0; i--) {
        const timeout = setTimeout(() => {
          if (
            this.currentState === SuikaGameState.GameOver ||
            this.currentState === SuikaGameState.Restart
          )
            return;

          this.store.dispatch(new UpdateGameLoseTimer(i));

          const aY2 = bodyA.position.y - getFruitData(bodyA.fruitId).size;
          const bY2 = bodyB.position.y - getFruitData(bodyB.fruitId).size;

          if (
            aY2 < settings.size.topBuffer ||
            (bY2 < settings.size.topBuffer &&
              Composite.allBodies(this.world).includes(bodyA) &&
              Composite.allBodies(this.world).includes(bodyB))
          ) {
            if (i === 0) {
              this.store.dispatch(new UpdateGameState(SuikaGameState.GameOver));
            }
          } else {
            this.store.dispatch(new UpdateGameLoseTimer(0));

            timeouts.forEach((timeout) => clearTimeout(timeout));
            this.allTimeouts.forEach((timeout) => clearTimeout(timeout));
          }
        }, ++iter * 1000);

        timeouts.push(timeout);
        this.allTimeouts.push(timeout);
      }
    }

    // merge fruits if possible
    if (
      bodyA.fruitId === bodyB.fruitId &&
      !bodyA.hasMerged &&
      !bodyB.hasMerged
    ) {
      bodyA.hasMerged = true;
      bodyB.hasMerged = true;

      const newFruitId = bodyA.fruitId + 1;

      const existingFruitData = getFruitData(bodyA.fruitId);
      this.store.dispatch(new UpdateScore(existingFruitData.score));

      const fruitData = getFruitData(newFruitId);
      if (fruitData) {
        const midPosX = (bodyA.position.x + bodyB.position.x) / 2;
        const midPosY = (bodyA.position.y + bodyB.position.y) / 2;

        Composite.add(
          this.world,
          this.generateFruitBody(midPosX, midPosY, newFruitId),
        );
      }

      Composite.remove(this.world, [bodyA, bodyB]);
    }
  }
}
