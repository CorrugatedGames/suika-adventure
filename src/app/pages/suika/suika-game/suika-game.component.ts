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
  UpdateGameState,
  UpdateNextFruit,
} from '../../../../stores/suika/suika.actions';
import { settings } from './settings';

import seedrandom from 'seedrandom';

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
    combineLatest([this.state$, this.currentFruit$, this.nextFruit$]).subscribe(
      ([state, currentFruit, nextFruit]) => {
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

    Composite.add(this.world, [
      // walls
      Bodies.rectangle(
        0,
        settings.size.height / 2 + settings.size.topBuffer,
        settings.size.wallWidth,
        settings.size.height,
        {
          isStatic: true,
        },
      ),
      Bodies.rectangle(
        settings.size.width,
        settings.size.height / 2 + settings.size.topBuffer,
        settings.size.wallWidth,
        settings.size.height,
        {
          isStatic: true,
        },
      ),
      Bodies.rectangle(
        settings.size.width / 2,
        settings.size.height,
        settings.size.width,
        settings.size.wallWidth,
        {
          isStatic: true,
        },
      ),
    ]);

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

    this.cycleFruits();
  }

  private updateFruitPosition() {
    if (!this.previewBody) return;

    Body.set(this.previewBody, 'position', {
      x: this.lastMousePosition,
      y: settings.size.dropOffset,
    });
  }

  private ensureFruitIsInBounds(positionX: number) {
    const { min, max } = this.boundsForFruit(this.currentFruit);
    const clampedX = Math.max(min, Math.min(max, positionX));
    this.lastMousePosition = clampedX;

    this.updateFruitPosition();
  }

  private boundsForFruit(fruit: SuikaFruit) {
    const wallSize = settings.size.wallWidth / 2;
    const fruitData = settings.fruits[fruit];
    const fruitSize = fruitData.size;

    return {
      min: wallSize + fruitSize,
      max: settings.size.width - wallSize - fruitSize,
    };
  }

  private cycleFruits() {
    const newFruit = this.getRandomDroppableFruit();

    this.store.dispatch([
      new UpdateCurrentFruit(this.nextFruit),
      new UpdateNextFruit(newFruit),
      new UpdateGameState(SuikaGameState.Ready),
    ]);

    this.createNewPreviewBody();
  }

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

    (droppedFruit as ISuikaFruitBody).fruitId = this.currentFruit;

    Composite.add(this.world, droppedFruit);

    setTimeout(() => {
      this.cycleFruits();
    }, 200);
  }

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

  private getFruitData(fruit: SuikaFruit) {
    return settings.fruits[fruit];
  }

  private generateFruitBody(
    x: number,
    y: number,
    suikaFruit: SuikaFruit,
    extraOpts = {},
  ) {
    return Bodies.circle(x, y, this.getFruitData(suikaFruit).size, {
      ...settings.friction,
      ...extraOpts,
    });
  }
}
