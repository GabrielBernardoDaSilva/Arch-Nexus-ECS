import { Archetype } from "./archetype";
import { Component } from "./component";
import { World } from "./world";

export type QuerySearchType = new (...args: any[]) => Component;

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
export class Query<T extends QuerySearchType[]> {
  types: T;
  constructor(world: World, ...types: T) {
    this.types = types;
    this.world = world;
    this.world.queryCount++;
  }
  result: QuerySearchType[][] = [];
  world: World;
  queryNeedToUpdate: boolean = true;
  private queryType: QueryType = QueryType.All;

  private find(): Query<T> {
    if (!this.queryNeedToUpdate) return this;
    const archetypes = this.world.archetypes;
    const result: QuerySearchType[][] = [];
    for (const archetype of archetypes) {
      const components = archetype.components;
      const entities = archetype.entities;
      if (this.types.every((type) => archetype.hasComponentType(type))) {
        for (const entity of entities) {
          const entityComponents: QuerySearchType[] = [];
          for (const type of this.types) {
            const componentName = type.name;
            const componentList = components.get(componentName);
            if (componentList) {
              const index = entities.indexOf(entity);
              entityComponents.push(
                componentList.components[index] as QuerySearchType
              );
            }
          }
          if (entityComponents.length === this.types.length) {
            result.push(entityComponents);
          }
        }
      }
    }
    this.result = result;
    this.queryNeedToUpdate = false;
    return this;
  }

  public findFirst() {
    this.queryType = QueryType.First;
  }
  public findLast() {
    this.queryType = QueryType.Last;
  }
  public findNone() {
    this.queryType = QueryType.None;
  }
  public findAll() {
    this.queryType = QueryType.All;
  }

  public resolveQueryResultTypeMapper<U extends unknown[]>() {
    if (!this.world) return;
    if (this.world.archetypesModified) this.queryNeedToUpdate = true;

    if (this.queryNeedToUpdate) {
      console.log("Query need to update");
      this.find();
      this.world.queryActualConsumeHasArchetypeChanged++;
      console.log(this.world.queryActualConsumeHasArchetypeChanged);
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
