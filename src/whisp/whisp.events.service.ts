import { Injectable } from '@nestjs/common';
import { EventService } from '../event/event.service';

export enum WhispEvent {
  AfterSave = 'AFTER_SAVE',
}

@Injectable()
export class WhispEventsService {
  private events: string[];

  constructor(private readonly eventService: EventService) {
    this.events = Object.keys(WhispEvent).map(event => WhispEvent[event]);
    this.events.forEach(eventName => {
      this.eventService.registerEvent(eventName);
    });
  }

  public trigger(eventName: WhispEvent, payload: any) {
    this.eventService.triggerEvent(eventName, payload);
  }
}
