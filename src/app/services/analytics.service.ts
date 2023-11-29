import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  init() {}

  sendDesignEvent(event: string, value: number) {
    console.log({ event, value})
  }
}
