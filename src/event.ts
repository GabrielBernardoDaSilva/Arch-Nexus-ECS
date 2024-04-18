export class Event {}

export type EventType = new (...args: unknown[]) => Event;

export class EventList<T extends Event> {
  private events: T[] = [];
  private subscribers: Function[] = [];

  addEvent(event: T) {
    this.events.push(event);
    this.notifySubscribers(event);
  }

  addSubscriber(subscriber: Function) {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: Function) {
    const index = this.subscribers.indexOf(subscriber);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  private notifySubscribers(event: Event) {
    for (const subscriber of this.subscribers) {
      subscriber(event);
    }
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

  addSubscriber<E extends Event>(ev: E, subscriber: Function) {
    const eventType = ev.constructor.name;
    if (!this.events.has(eventType)) {
      this.events.set(eventType, new EventList());
    }
    this.events.get(eventType)!.addSubscriber(subscriber);
  }

  unsubscribe<E extends Event>(ev: E, subscriber: Function) {
    const eventType = ev.constructor.name;
    if (this.events.has(eventType)) {
      this.events.get(eventType)!.unsubscribe(subscriber);
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
