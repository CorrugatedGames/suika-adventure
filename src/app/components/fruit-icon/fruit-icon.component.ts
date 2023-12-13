import { Component, Input } from '@angular/core';
import { SuikaFruit } from '../../../interfaces';
import { getFruitData } from '../../helpers/suika/fruit-data';
import { settings } from '../../settings';

@Component({
  selector: 'app-fruit-icon',
  templateUrl: './fruit-icon.component.html',
  styleUrl: './fruit-icon.component.scss',
})
export class FruitIconComponent {
  @Input({ required: true }) fruit!: SuikaFruit;
  @Input() public size = 24;

  public get fruitName(): string {
    const fruitData = getFruitData(this.fruit);
    return fruitData.fruitId;
  }

  public get shapeFolder() {
    return settings.game.renderCustomShapes ? 'images' : 'images-circular';
  }

  public get sprite(): string {
    return `assets/fruit/${this.shapeFolder}/${this.fruitName}.png`;
  }
}
