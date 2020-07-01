export enum EventNames {
  WHISP_CREATED = 'WHISP_CREATED',
  WHISP_UPDATED = 'WHISP_UPDATED',
  WHISP_REPLACED = 'WHISP_REPLACED',
  WHISP_DELETED = 'WHISP_DELETED',
}

export class Event {
  name: EventNames;

  payload: unknown;

  constructor(name: EventNames, payload: unknown) {
    this.name = name;
    this.payload = payload;
  }
}
