/* eslint-disable @typescript-eslint/no-explicit-any */

import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import { HardReset } from '../../stores';

@Injectable({
  providedIn: 'root',
})
export class DebugService {
  constructor(private store: Store) {}

  init() {
    (window as any).hardReset = () => {
      this.store.dispatch(new HardReset());
      localStorage.clear();
      window.location.reload();
    };
  }
}
