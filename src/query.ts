import { Archetype } from "./archetype";
import { Component } from "./component";
import { World } from "./world";

export type QuerySearchType = new (...args: any[]) => Component | Component;

enum QueryType {
  All,
  First,
  Last,
  None,
}

// Query class
// This class will be used to query for entities that have a specific set of components.
// It will be used to find all entities that have a specific set of components.
// The Query class will have a constructor that takes an array of types.
// The types will be the components that the query will look for.
export class Query<T extends QuerySearchType[], U extends QuerySearchType[]> {
  private withTypes: T;
  private withOutTypes: U;


  constructor(world: World) {
    this.world = world;
    this.world.queryCount++;
  }
  private result: QuerySearchType[][] = [];
  private world: World;
  queryNeedToUpdate: boolean = true;
  private queryType: QueryType = QueryType.All;

  private execute(): Query<T, U> {
    if (!this.queryNeedToUpdate) return this;
    const archetypes = this.world.archetypes;
    const result: QuerySearchType[][] = [];
    for (const archetype of archetypes) {
      const components = archetype.components;
      const entities = archetype.entities;
      if (
        this.withTypes.every(
          (type) =>
            archetype.hasComponentType(type) &&
            !this.withOutTypes?.some((t) => archetype.hasComponentType(t))
        )
      ) {
        for (const entity of entities) {
          const entityComponents: QuerySearchType[] = [];
          for (const type of this.withTypes) {
            const componentName = type.name;
            const componentList = components.get(componentName);
            if (componentList) {
              const index = entities.indexOf(entity);
              entityComponents.push(
                componentList.components[index] as QuerySearchType
              );
            }
          }
          if (entityComponents.length === this.withTypes.length) {
            result.push(entityComponents);
          }
        }
      }
    }
    this.result = result;
    this.queryNeedToUpdate = false;
    return this;
  }

  public with<T extends QuerySearchType[]>(...types: T): Query<T, U> {
    const q = new Query<T, U>(this.world);
    q.withTypes = types;
    q.withOutTypes = this.withOutTypes as any;
    return q;
  }

  public without<U extends QuerySearchType[]>(...types: U): Query<T, U> {
    const q = new Query<T, U>(this.world);
    q.withTypes = this.withTypes as any;
    q.withOutTypes = types;
    return q;
  }

  public findFirst(): { [K in keyof T]: InstanceType<T[K]> } {
    this.queryType = QueryType.First;
    this.resolveQueryResultTypeMapper();
    return this.result[0] as unknown as { [K in keyof T]: InstanceType<T[K]> };
  }
  public findLast(): [{ [K in keyof T]: InstanceType<T[K]> }] {
    this.queryType = QueryType.Last;
    this.resolveQueryResultTypeMapper();
    return [this.result[this.result.length - 1]] as unknown as [
      { [K in keyof T]: InstanceType<T[K]> }
    ];
  }
  public findNone() {
    this.queryType = QueryType.None;
    this.resolveQueryResultTypeMapper();
    return [];
  }
  public findAll(): { [K in keyof T]: InstanceType<T[K]> }[] {
    this.queryType = QueryType.All;
    this.resolveQueryResultTypeMapper();
    return this.result as unknown as { [K in keyof T]: InstanceType<T[K]> }[];
  }

  public resolveQueryResultTypeMapper<U extends unknown[]>() {
    if (!this.world) return;
    if (this.world.archetypesModified) this.queryNeedToUpdate = true;

    if (this.queryNeedToUpdate) {
      this.execute();
      this.world.queryActualConsumeHasArchetypeChanged++;
    }
    switch (this.queryType) {
      case QueryType.All:
        return this.result as U[];
      case QueryType.First:
        return [this.result[0]] as U[];
      case QueryType.Last:
        return [this.result[this.result.length - 1]] as U[];
      case QueryType.None:
        return [] as U[];
      default:
        return [] as U[];
    }
  }
}
