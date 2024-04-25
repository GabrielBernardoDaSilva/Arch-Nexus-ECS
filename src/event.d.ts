export declare class Event {
}
export type EventType = new (...args: unknown[]) => Event;
export declare class EventList<T extends Event> {
    private events;
    private subscribers;
    addEvent(event: T): void;
    addSubscriber(subscriber: Function): void;
    unsubscribe(subscriber: Function): void;
    private notifySubscribers;
    get length(): number;
}
export declare class EventManager {
    private events;
    addEvent<E extends Event>(event: E): void;
    addSubscriber<E extends Event>(ev: E, subscriber: Function): void;
    unsubscribe<E extends Event>(ev: E, subscriber: Function): void;
    get length(): number;
}
