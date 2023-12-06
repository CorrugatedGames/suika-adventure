import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { SuikaGameComponent } from './suika-game/suika-game.component';
import { SuikaComponent } from './suika.component';

@NgModule({
  declarations: [SuikaComponent, SuikaGameComponent],
  imports: [CommonModule, SharedModule],
})
export class SuikaModule {}
