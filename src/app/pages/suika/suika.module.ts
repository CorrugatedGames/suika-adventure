import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SuikaComponent } from './suika.component';
import { SuikaGameComponent } from './suika-game/suika-game.component';



@NgModule({
  declarations: [
    SuikaComponent,
    SuikaGameComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class SuikaModule { }
