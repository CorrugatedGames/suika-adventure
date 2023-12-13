import { Component } from '@angular/core';
import { SuikaFruit } from '../../../interfaces';

@Component({
  selector: 'app-rotary',
  templateUrl: './rotary.component.html',
  styleUrl: './rotary.component.scss',
})
export class RotaryComponent {
  public readonly fruits = [
    [
      {
        fruit: SuikaFruit.Cherry,
        size: 24,
      },
      {
        fruit: SuikaFruit.Strawberry,
        size: 32,
      },
    ],
    [
      {
        fruit: SuikaFruit.Grape,
        size: 40,
      },
      {
        fruit: SuikaFruit.Clementine,
        size: 48,
      },
    ],
    [
      {
        fruit: SuikaFruit.Orange,
        size: 56,
      },
      {
        fruit: SuikaFruit.Pomegranate,
        size: 64,
      },
    ],
    [
      {
        fruit: SuikaFruit.Lemon,
        size: 72,
      },
      {
        fruit: SuikaFruit.Peach,
        size: 80,
      },
    ],
    [
      {
        fruit: SuikaFruit.Pineapple,
        size: 88,
      },
      {
        fruit: SuikaFruit.Cantaloupe,
        size: 96,
      },
    ],
    [
      {
        fruit: SuikaFruit.Watermelon,
        size: 208,
      },
    ],
  ];
}
