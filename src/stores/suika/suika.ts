import { Injectable } from '@angular/core';
import { Selector, State } from '@ngxs/store';
import { attachAction } from '@seiyria/ngxs-attach-action';
import { ISuika } from '../../interfaces/suika';
import { attachments } from './suika.attachments';
import { defaultSuika } from './suika.functions';

@State<ISuika>({
  name: 'suika',
  defaults: defaultSuika(),
})
@Injectable()
export class SuikaState {
  constructor() {
    attachments.forEach(({ action, handler }) => {
      attachAction(SuikaState, action, handler);
    });
  }

  @Selector()
  static score(state: ISuika) {
    return state.score;
  }

  @Selector()
  static bestScore(state: ISuika) {
    return state.bestScore;
  }

  @Selector()
  static currentFruit(state: ISuika) {
    return state.currentFruit;
  }

  @Selector()
  static nextFruit(state: ISuika) {
    return state.nextFruit;
  }

  @Selector()
  static gameLoseTimer(state: ISuika) {
    return state.gameLoseTimer;
  }

  @Selector()
  static state(state: ISuika) {
    return state.gameState;
  }
}
