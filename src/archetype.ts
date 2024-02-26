import { Component, ComponentList } from "./component";

type EntityId = number;

export class EntityLocation {
  constructor(public id: number, public archetypeIndex: number) {}
}

export class Entity extends Component {
  constructor(public id: EntityId) {
    super();
  }
}
/// An archetype is a collection of entities that all have the same set of components.
/// This is a way to organize entities and components in a way that is efficient for
/// the ECS system to process.
/// once an archetype is created, it cannot be modified.
/// The components that are added to the archetype are stored in a map where the key is the
/// name of the component and the value is a list of components of that type.
/// but the entities that are added to the archetype are stored in a separate list.
export class Archetype {
  components: Map<string, ComponentList> = new Map();
  entities: EntityId[] = [];

  constructor(entityId: EntityId, ...components: Component[]) {
    this.addComponents(entityId, ...components);
  }

  public hasComponentType<T extends Component>(
    type: new (...args: unknown[]) => T
  ): boolean {
    return this.components.has(type.name);
  }
  public hasAllComponentsByString<T extends Component>(
    ...components: T[]
  ): boolean {
    const types = components.map((component) => component.constructor.name);
    return types.every((type) => this.components.has(type));
  }

  public hasAllComponents(
    ...types: (new (...args: unknown[]) => unknown)[]
  ): boolean {
    return types.every((type) => this.hasComponentType(type));
  }

  public addNewEntity(entityId: EntityId, ...components: Component[]) {
    this.addComponents(entityId, ...components);
  }

  addComponents(entityId: EntityId, ...components: Component[]) {
    components.push(new Entity(entityId));
    for (const component of components) {
      const componentName = component.constructor.name;
      if (!this.components.has(componentName)) {
        this.components.set(componentName, new ComponentList());
      }
      this.components.get(componentName).addComponent(component);
    }
    this.entities.push(entityId);
  }

  public migrateEntityToOtherArchetype(
    entityId: EntityId,
    otherArchetype: Archetype
  ) {
    const components = [];
    if (this.entities.includes(entityId)) {
      for (const [componentName, componentList] of this.components) {
        const indexOfEntity = this.entities.indexOf(entityId);
        const component = componentList.components[indexOfEntity];
        components.push({
          componentName,
          component,
        });
      }
      this.entities = this.entities.filter((id) => id !== entityId);

      for (const component of components) {
        const componentName = component.componentName;
        const componentInstance = component.component;
        //check if this archetype has the component
        if (
          !otherArchetype.hasComponentType(
            componentInstance.constructor as new (...args: any[]) => Component
          )
        ) {
          otherArchetype.components.set(componentName, new ComponentList());
        }
        otherArchetype.addComponents(entityId, componentInstance);
      }
    }
  }

  public removeComponent(
    entityId: EntityId,
    component: Component
  ): [EntityId, Map<string, Component>] {
    const componentName = component.constructor.name;
    if (this.components.has(componentName)) {
      const componentList = this.components.get(componentName);
      const index = this.entities.indexOf(entityId);
      componentList.removeComponent(index);

      const componentsOfThisEntityToMigrate = new Map<string, Component>();
      for (const [componentName, componentList] of this.components) {
        const component = componentList.components[index];
        componentsOfThisEntityToMigrate.set(componentName, component);
        componentList.removeComponent(index);
      }

      this.entities = this.entities.filter((id) => id !== entityId);
      return [entityId, componentsOfThisEntityToMigrate];
    }
  }
  public removeEntity(entityId: EntityId) {
    const index = this.entities.indexOf(entityId);
    if (index !== -1) {
      for (const [_, componentList] of this.components) {
        componentList.removeComponent(index);
      }
      this.entities = this.entities.filter((id) => id !== entityId);
    }
  }
}
