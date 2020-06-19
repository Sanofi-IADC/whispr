import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  private registeredEvents: string[] = [];

  public registerEvent(eventName: string) {
    console.log('REGISTER', eventName);
    this.registeredEvents = [...this.registeredEvents, eventName];
  }

  public triggerEvent(eventName: string, payload: any) {
    console.log('TRIGGER', eventName, payload);
  }
}
