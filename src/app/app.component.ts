import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, first } from 'rxjs';
import { SuikaGameState } from '../interfaces';
import { SuikaState } from '../stores';
import { UpdateGameState } from '../stores/suika/suika.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  @Select(SuikaState.state) state$!: Observable<SuikaGameState>;

  constructor(private store: Store) {}

  ngOnInit() {
    this.state$.pipe(first()).subscribe((state) => {
      if (state !== SuikaGameState.GameOver) return;

      this.store.dispatch(new UpdateGameState(SuikaGameState.Ready));
    });
  }
}
