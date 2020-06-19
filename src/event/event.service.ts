import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  private registeredEvents: string[] = [];

  private registeredListeners: {
    [eventName: string]: ((...args: any[]) => any)[];
  } = {};

  public registerEvent(eventName: string) {
    if (this.isRegisteredEvent(eventName)) {
      throw new Error(`Event ${eventName} has already been registered`);
    }
    this.registeredEvents = [...this.registeredEvents, eventName];
    this.registeredListeners[eventName] = [];
  }

  public async triggerEvent(eventName: string, payload: any) {
    if (!this.isRegisteredEvent(eventName)) {
      throw new Error(
        `Event ${eventName} was triggered but it is not registered.`,
      );
    }
    const listeners = this.registeredListeners[eventName];
    for (
      let listenerIndex = 0;
      listenerIndex < listeners.length;
      listenerIndex += 1
    ) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve, reject) => {
        function next(error?: Error) {
          if (error) {
            reject(error);
          }
          resolve();
        }
        listeners[listenerIndex](payload, next);
      });
    }
  }

  public registerListener(
    eventName: string,
    callback: (...args: any[]) => any,
  ) {
    if (!this.isRegisteredEvent(eventName)) {
      throw new Error(`Event ${eventName} does not exist.`);
    }
    this.registeredListeners[eventName] = [
      ...this.registeredListeners[eventName],
      callback,
    ];
  }

  private isRegisteredEvent(eventName: string) {
    return this.registeredEvents.includes(eventName);
  }
}
