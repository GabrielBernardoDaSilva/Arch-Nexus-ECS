import { Archetype } from "./archetype";
import { Component } from "./component";
import { World } from "./world";

type QuerySearchType = new (...args: any[]) => Component;

// but using the type mapping, we can map the types to their actual types strings
type QueryResultTypeMapper<T extends QuerySearchType[]> = {
  [P in keyof T]: T[P];
};

// Query class
// This class will be used to query for entities that have a specific set of components.
// It will be used to find all entities that have a specific set of components.
// The Query class will have a constructor that takes an array of types.
// The types will be the components that the query will look for.
export class Query<T extends QuerySearchType[]> {
  types: T;
  constructor(...types: T) {
    this.types = types;
  }
  result: QuerySearchType[][] = [];
  queryResultTypeMapper: QueryResultTypeMapper<T>;

  queryNeedToUpdate: boolean = true;

  public findAll(world: World): Query<T> {
    if (!this.queryNeedToUpdate) return this;
    const archetypes = world.archetypes;
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

  public resolveQueryResultTypeMapper<U extends unknown[]>() {
    return this.result as U[];
  }
}
