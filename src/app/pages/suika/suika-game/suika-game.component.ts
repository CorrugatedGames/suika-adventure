import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { v4 as uuid } from 'uuid';

import { Select, Store } from '@ngxs/store';
import {
  Body,
  Common,
  Composite,
  Engine,
  Events,
  Query,
  Render,
  Runner,
  World,
} from 'matter-js';
import { Observable, combineLatest } from 'rxjs';
import {
  IGameMatterState,
  ISuikaFruitBody,
  SuikaFruit,
  SuikaGameState,
} from '../../../../interfaces';
import { SuikaState } from '../../../../stores';
import {
  SetGameId,
  UpdateCurrentFruit,
  UpdateGameLoseTimer,
  UpdateGameState,
  UpdateNextFruit,
  UpdateScore,
} from '../../../../stores/suika/suika.actions';
import { settings } from '../../../settings';

import seedrandom from 'seedrandom';
import {
  addFruitToWorld,
  attemptFruitMerge,
  boundsForFruit,
  createMatterWorld,
  generateFruitBody,
  generatePreviewFruitBody,
  getFruitData,
  getRandomDroppableFruit,
} from '../../../helpers';

/*
TODO:
- apply forces to merged fruits
- uncouple everything from ui I hate it
*/

import Decomp from 'poly-decomp';

Common.setDecomp(Decomp);

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

  private loseBodies: Body[] = [];
  private fruitBodies: Body[] = [];

  private startEndTimestamp = 0;
  private lastLoseTick = 0;

  private loseFn!: () => void;

  private prng = seedrandom('default seed');

  constructor(private store: Store) {}

  ngOnInit() {
    combineLatest([this.state$, this.currentFruit$, this.nextFruit$]).subscribe(
      ([state, currentFruit, nextFruit]) => {
        if (state === SuikaGameState.Restart) {
          this.uninitGame();

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

  private uninitGame() {
    this.isInit = false;
    this.previewBody = null;

    this.loseBodies = [];
    this.fruitBodies = [];

    Events.off(this.runner, 'afterTick', this.loseFn);
    World.clear(this.world, false);
    Engine.clear(this.engine);
    Render.stop(this.render);
    Runner.stop(this.runner);
  }

  private initGame() {
    this.canvasRef.nativeElement.width = settings.size.width;
    this.canvasRef.nativeElement.height = settings.size.height;

    const gameId = uuid();
    this.store.dispatch(new SetGameId(gameId));

    this.prng = seedrandom(gameId);

    const { engine, world, render, runner, mouseConstraint, loseBodies } =
      createMatterWorld(this.canvasRef.nativeElement);

    this.engine = engine;
    this.world = world;
    this.render = render;
    this.runner = runner;
    this.loseBodies = loseBodies;

    // lose checking
    this.loseFn = () => this.afterTick();
    Events.on(this.runner, 'afterTick', this.loseFn);

    // collision events
    Events.on(this.engine, 'collisionStart', (e) => {
      for (let i = 0; i < e.pairs.length; i++) {
        const { bodyA, bodyB } = e.pairs[i];
        this.bodyCollision(bodyA as ISuikaFruitBody, bodyB as ISuikaFruitBody);
      }
    });

    Events.on(mouseConstraint, 'mouseup', () => {
      this.addCurrentFruit(this.lastMousePosition);
    });

    Events.on(mouseConstraint, 'mousemove', (e) => {
      this.lastMousePosition = e.mouse.position.x;
      if (this.currentState !== SuikaGameState.Ready || !this.previewBody)
        return;

      this.ensureFruitIsInBounds(e.mouse.position.x);
    });

    // generate the first two fruits
    this.cycleFruits();
  }

  private afterTick() {
    const collisions = Query.collides(this.loseBodies[0], this.fruitBodies);
    if (collisions.length === 0) {
      this.startEndTimestamp = 0;
      this.lastLoseTick = 0;
      this.store.dispatch(new UpdateGameLoseTimer(0));
      return;
    }

    if (!this.startEndTimestamp) this.startEndTimestamp = Date.now();

    const secondsElapsed =
      Math.floor((Date.now() - this.startEndTimestamp) / 1000) - 1;

    // grace period
    if (secondsElapsed > 0 && secondsElapsed > this.lastLoseTick) {
      console.log({ secondsElapsed, lastLoseTick: this.lastLoseTick });
      this.store.dispatch(
        new UpdateGameLoseTimer(settings.game.lossSeconds - this.lastLoseTick),
      );

      this.lastLoseTick++;

      if (this.lastLoseTick >= settings.game.lossSeconds) {
        this.startEndTimestamp = 0;
        this.lastLoseTick = 0;
        this.store.dispatch([
          new UpdateGameLoseTimer(0),
          new UpdateGameState(SuikaGameState.GameOver),
        ]);
      }
    }
  }

  private getGameMatterState(): IGameMatterState {
    return {
      store: this.store,
      state: this.currentState,
      engine: this.engine,
      world: this.world,
      render: this.render,
      runner: this.runner,
      prng: this.prng,
    };
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
    const { min, max } = boundsForFruit(this.currentFruit);
    const clampedX = Math.max(min, Math.min(max, positionX));
    this.lastMousePosition = clampedX;

    this.updateFruitPosition();
  }

  // switch to the next fruit and generate a new one
  private cycleFruits() {
    const newFruit = getRandomDroppableFruit(this.getGameMatterState());

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

    this.store.dispatch(new UpdateGameState(SuikaGameState.Dropping));

    Composite.remove(this.world, this.previewBody);

    const droppedFruit = generateFruitBody(
      dropX,
      settings.size.dropOffset,
      this.currentFruit,
    );

    addFruitToWorld(this.getGameMatterState(), dropX, droppedFruit);
    this.fruitBodies.push(droppedFruit);

    this.previewBody = null;

    setTimeout(() => {
      this.cycleFruits();
    }, settings.game.dropDelay);
  }

  // create a new preview fruit
  private createNewPreviewBody() {
    if (this.previewBody) return;

    this.previewBody = generatePreviewFruitBody(
      this.lastMousePosition,
      this.currentFruit,
    );

    this.ensureFruitIsInBounds(this.lastMousePosition);

    Composite.add(this.world, this.previewBody);
  }

  // two bodies collide, but it's just two fruits usually
  private bodyCollision(bodyA: ISuikaFruitBody, bodyB: ISuikaFruitBody) {
    if (!bodyA.fruitId || !bodyB.fruitId) return;

    // merge fruits if possible
    const mergedBody = attemptFruitMerge(
      this.getGameMatterState(),
      bodyA,
      bodyB,
    );
    if (mergedBody) {
      this.fruitBodies = this.fruitBodies.filter(
        (body) => body !== bodyA && body !== bodyB,
      );
      this.fruitBodies.push(mergedBody);
      const existingFruitData = getFruitData(bodyA.fruitId as SuikaFruit);
      this.store.dispatch(new UpdateScore(existingFruitData.score));
    }
  }
}
