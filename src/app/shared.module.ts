import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FruitIconComponent } from './components/fruit-icon/fruit-icon.component';
import { NextFruitComponent } from './components/next-fruit/next-fruit.component';
import { RotaryComponent } from './components/rotary/rotary.component';

const sharedItems = [NextFruitComponent, RotaryComponent, FruitIconComponent];

@NgModule({
  declarations: sharedItems,
  exports: sharedItems,
  imports: [CommonModule],
})
export class SharedModule {}
