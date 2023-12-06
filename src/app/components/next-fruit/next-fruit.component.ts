import { Component } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SuikaFruit } from '../../../interfaces';
import { SuikaState } from '../../../stores';

@Component({
  selector: 'app-next-fruit',
  templateUrl: './next-fruit.component.html',
  styleUrl: './next-fruit.component.scss',
})
export class NextFruitComponent {
  @Select(SuikaState.nextFruit) public nextFruit$!: Observable<SuikaFruit>;
}
