import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  constructor() { }

  notify(message: string) {
    console.log(message);
  }

  warn(message: string) {
    this.notify(message);}

  error(message: string) {
    this.notify(message);}

  success(message: string) {
    this.notify(message);
  }

}
