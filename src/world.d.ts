import { Archetype, Entity, EntityLocation } from "./archetype";
import { Component } from "./component";
import { Event, EventManager, EventType } from "./event";
import { PluginType } from "./plugin";
import { Query, QuerySearchType } from "./query";
import { TaskScheduler } from "./scheduler";
import { System, SystemType } from "./system";
export declare class World {
    archetypes: Archetype[];
    entities: EntityLocation[];
    systems: System[];
    schedulerSystem: TaskScheduler[];
    eventManager: EventManager;
    queryCount: number;
    queryActualConsumeHasArchetypeChanged: number;
    private hasArchetypeChanged;
    private static id;
    addEntity<T extends Component[]>(...comps: T): Entity;
    addComponentToEntity<T extends Component>(entity: Entity, component: T): void;
    getComponentFromEntity<T extends Component[]>(entity: Entity, component: new (...args: unknown[]) => T): T | undefined;
    private migrateEntityToOtherArchetype;
    removeComponentFromEntity<T extends Component>(entity: Entity, component: T): void;
    removeEntity(entity: Entity): void;
    private checkIfArchetypeIsMarkedToRemove;
    addSystem<T extends SystemType>(system: T | System): void;
    addSystems(...systems: SystemType[]): void;
    startUp(): void;
    update(): void;
    destroy(): void;
    addTaskScheduler(task: TaskScheduler): void;
    pauseTaskScheduler(name: string): void;
    pauseAllTaskScheduler(): void;
    resumeTaskScheduler(name: string): void;
    startAllTaskScheduler(): void;
    startTaskScheduler(name: string): void;
    createQuery<T extends QuerySearchType[], U extends QuerySearchType[]>(): Query<T, U>;
    addPlugin(plugin: PluginType): void;
    get archetypesModified(): boolean;
    addEvent<E extends Event>(event: E): void;
    addSubscriber<E extends EventType>(ev: E, subscriber: Function): void;
    unsubscribe<E extends EventType>(ev: E, subscriber: Function): void;
}
