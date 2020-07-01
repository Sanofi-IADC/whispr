import { Event } from '../event/event.entity';

export type ListenerCallback = (event: Event) => Promise<void>;

export interface IListener {
  callback: ListenerCallback;
  filter: Record<string, unknown>;
}
