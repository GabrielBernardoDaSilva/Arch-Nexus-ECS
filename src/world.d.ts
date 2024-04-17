import { Archetype, Entity, EntityLocation } from "./archetype";
import { Component } from "./component";
import { IPlugin } from "./plugin";
import { Query, QuerySearchType } from "./query";
import { TaskScheduler } from "./scheduler";
import { System, SystemType } from "./system";
export declare class World {
  archetypes: Archetype[];
  entities: EntityLocation[];
  systems: System[];
  schedulerSystem: TaskScheduler[];
  queryCount: number;
  queryActualConsumeHasArchetypeChanged: number;
  private hasArchetypeChanged;
  private static id;
  addEntity<T extends Component[]>(...comps: T): Entity;
  addComponentToEntity<T extends Component>(entity: Entity, component: T): void;
  private migrateEntityToOtherArchetype;
  removeComponentFromEntity<T extends Component>(
    entity: Entity,
    component: T
  ): void;
  removeEntity(entity: Entity): void;
  private checkIfArchetypeIsMarkedToRemove;
  addSystem<T extends SystemType>(system: T | System): void;
  addSystems(...systems: SystemType[]): void;
  startUp(): void;
  update(): void;
  addTaskScheduler(task: TaskScheduler): void;
  pauseTaskScheduler(name: string): void;
  pauseAllTaskScheduler(): void;
  resumeTaskScheduler(name: string): void;
  startAllTaskScheduler(): void;
  startTaskScheduler(name: string): void;
  createQuery<T extends QuerySearchType[]>(...comps: T): Query<T>;
  addPlugin(plugin: IPlugin): void;
  get archetypesModified(): boolean;
}
