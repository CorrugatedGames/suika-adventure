import {
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SuikaGameState } from '../../../interfaces';
import { SuikaState } from '../../../stores';
import { UpdateGameState } from '../../../stores/suika/suika.actions';

@Component({
  selector: 'app-suika',
  templateUrl: './suika.component.html',
  styleUrl: './suika.component.scss',
})
export class SuikaComponent implements OnInit {
  private destroyRef = inject(DestroyRef);

  private isGameOverOpen = false;

  @ViewChild('gameOverModal') gameOverModalRef!: NgbModal;

  @Select(SuikaState.state) state$!: Observable<SuikaGameState>;
  @Select(SuikaState.bestScore) bestScore$!: Observable<number>;
  @Select(SuikaState.score) score$!: Observable<number>;
  @Select(SuikaState.gameLoseTimer) gameLoseTimer$!: Observable<number>;

  constructor(
    private store: Store,
    private modalService: NgbModal,
  ) {}

  ngOnInit() {
    this.state$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => {
      if (state !== SuikaGameState.GameOver) return;

      this.gameOverModal();
    });
  }

  async gameOverModal() {
    if (this.isGameOverOpen) return;
    this.isGameOverOpen = true;

    try {
      await this.modalService.open(this.gameOverModalRef, {
        backdrop: 'static',
        keyboard: false,
        centered: true,
      }).result;
    } catch {
      // Do nothing
    }

    this.isGameOverOpen = false;

    this.restartGame();
  }

  gameOver() {
    this.store.dispatch(new UpdateGameState(SuikaGameState.GameOver));
  }

  restartGame() {
    this.store.dispatch(new UpdateGameState(SuikaGameState.Restart));
  }
}
