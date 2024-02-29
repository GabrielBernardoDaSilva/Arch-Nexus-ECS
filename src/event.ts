export class Event {}

export class EventList<T extends Event> {
  private events: T[] = [];

  addEvent(event: T) {
    this.events.push(event);
  }

  consumeEvent() {
    return this.events.shift();
  }

  clearEvents() {
    this.events = [];
  }

  get length() {
    return this.events.length;
  }
}

export class EventManager {
  private events: Map<string, EventList<Event>> = new Map();

  addEvent<E extends Event>(event: E) {
    const eventType = event.constructor.name;

    if (!this.events.has(eventType)) {
      this.events.set(eventType, new EventList());
    }
    this.events.get(eventType)!.addEvent(event);
  }

  consumeEvent<E extends Event>(event: { new (): E }) {
    const eventType = event.name;
    if (this.events.has(eventType)) {
      return this.events.get(eventType)!.consumeEvent();
    }
  }

  clearEvents<E extends Event>(event: { new (): E }) {
    const eventType = event.name;
    if (this.events.has(eventType)) {
      this.events.get(eventType)!.clearEvents();
    }
  }

  get length() {
    let length = 0;
    for (const eventList of this.events.values()) {
      length += eventList.length;
    }
    return length;
  }
}
