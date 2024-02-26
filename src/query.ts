import { Archetype } from "./archetype";
import { Component } from "./component";

type QuerySearchType = new (...args: any[]) => Component;
type QueryResultType<T extends unknown> = [
  T extends [infer A] ? A : never,
  T extends [unknown, infer B] ? B : never
];

// Query class
// This class will be used to query for entities that have a specific set of components.
// It will be used to find all entities that have a specific set of components.
// The Query class will have a constructor that takes an array of types.
// The types will be the components that the query will look for.
export class Query<T extends QuerySearchType[]> {
  constructor(private types: T) {}

  public findAll(...archetypes: Archetype[]): QuerySearchType[][] {
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
    return result;
  }

  public convertToType<T extends unknown[]>(result: QuerySearchType[][]): T[] {
    return result as T[];
  }
}

