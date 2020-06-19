import { Injectable } from '@nestjs/common';
import { EventService } from '../event/event.service';

export enum WhispEvent {
  AfterSave = 'AFTER_SAVE',
  AfterDelete = 'AFTER_DELETE',
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

  public async trigger(eventName: WhispEvent, payload: any) {
    await this.eventService.triggerEvent(eventName, payload);
  }
}
