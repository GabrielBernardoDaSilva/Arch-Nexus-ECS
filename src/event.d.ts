export declare class Event {
}
export declare class EventList<T extends Event> {
    private events;
    addEvent(event: T): void;
    consumeEvent(): T;
    clearEvents(): void;
    get length(): number;
}
export declare class EventManager {
    private events;
    addEvent<E extends Event>(event: E): void;
    consumeEvent<E extends Event>(event: {
        new (): E;
    }): Event;
    clearEvents<E extends Event>(event: {
        new (): E;
    }): void;
    get length(): number;
}
