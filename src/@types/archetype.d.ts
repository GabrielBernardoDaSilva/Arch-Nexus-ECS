import { Component, ComponentList } from "../component";
type EntityId = number;
export declare class EntityLocation {
  id: number;
  archetypeIndex: number;
  componentsName: string[];
  constructor(id: number, archetypeIndex: number, componentsName: string[]);
}
export declare class Entity extends Component {
  id: EntityId;
  constructor(id: EntityId);
}
export declare class Archetype {
  components: Map<string, ComponentList>;
  entities: EntityId[];
  constructor(entityId: EntityId, ...components: Component[]);
  hasComponentType<T extends Component>(
    type: new (...args: unknown[]) => T
  ): boolean;
  hasAllComponentsByString<T extends Component>(components: T[]): boolean;
  hasAllComponents(...types: (new (...args: unknown[]) => unknown)[]): boolean;
  addNewEntity(entityId: EntityId, ...components: Component[]): void;
  addComponents(entityId: EntityId, ...components: Component[]): void;
  migrateEntityToOtherArchetype(
    entityId: EntityId,
    otherArchetype: Archetype
  ): void;
  removeComponent(
    entityId: EntityId,
    component: Component
  ): [EntityId, Map<string, Component>];
  removeEntity(entityId: EntityId): void;
  moveEntity(entityId: EntityId): [EntityId, Map<string, Component>];
}
export {};
