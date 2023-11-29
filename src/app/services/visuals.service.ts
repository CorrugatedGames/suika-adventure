import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VisualsService {

  constructor() { }

  playSoundEffect(sfx: string) {
    console.log({ sfx })
  }
}
