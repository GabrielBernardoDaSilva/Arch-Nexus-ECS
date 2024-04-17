import { Archetype, Entity, EntityLocation } from "./archetype";
import { Component } from "./component";
import { IPlugin } from "./plugin";
import { Query, QuerySearchType } from "./query";
import { TaskScheduler } from "./scheduler";
import { System, SystemType } from "./system";

export class World {
  archetypes: Archetype[] = [];
  entities: EntityLocation[] = [];
  systems: System[] = [];
  schedulerSystem: TaskScheduler[] = [];

  public queryCount = 0;
  public queryActualConsumeHasArchetypeChanged = 0;
  private hasArchetypeChanged = false;
  private static id = 0;

  public addEntity<T extends Component[]>(...comps: T): Entity {
    const entityId = World.id++;
    const components = [new Entity(entityId), ...comps];

    const archetypeFounded = this.archetypes.find((archetype) =>
      archetype.hasAllComponentsByString(components)
    );
    let indexOfArchetype = this.archetypes.length;

    if (archetypeFounded) {
      archetypeFounded.addNewEntity(entityId, ...components);
      indexOfArchetype = this.archetypes.indexOf(archetypeFounded);
    } else {
      const archetype = new Archetype(entityId, ...components);
      this.archetypes.push(archetype);
    }

    this.entities.push({
      id: entityId,
      archetypeIndex: indexOfArchetype,
      componentsName: components.map((component) => component.constructor.name),
    });
    this.hasArchetypeChanged = true;

    return new Entity(entityId);
  }

  public addComponentToEntity<T extends Component>(
    entity: Entity,
    component: T
  ) {
    const entityFounded = this.entities.find((ent) => ent.id === entity.id);
    if (entityFounded) {
      const archetype = this.archetypes[entityFounded.archetypeIndex];
      const moveEntity = archetype.moveEntity(entityFounded.id);
      if (moveEntity) {
        const componentName = component.constructor.name;
        moveEntity[1].set(componentName, component);
        this.migrateEntityToOtherArchetype(
          entityFounded,
          Array.from(moveEntity[1].values())
        );
      }
    }

    this.hasArchetypeChanged = true;
  }

  private migrateEntityToOtherArchetype<T extends Component>(
    entity: EntityLocation,
    components: T[]
  ) {
    let archetype = this.archetypes.find((archetype) =>
      archetype.hasAllComponentsByString(components)
    );
    if (archetype) archetype.addNewEntity(entity.id, ...components);
    else {
      archetype = new Archetype(entity.id, ...components);
      this.archetypes.push(archetype);
    }

    entity.componentsName = components.map(
      (component) => component.constructor.name
    );
    const oldArchetype = this.archetypes[entity.archetypeIndex];
    this.checkIfArchetypeIsMarkedToRemove(oldArchetype);
    const index = this.archetypes.indexOf(archetype);
    entity.archetypeIndex = index;
  }

  public removeComponentFromEntity<T extends Component>(
    entity: Entity,
    component: T
  ) {
    const entityFounded = this.entities.find((ent) => ent.id === entity.id);

    if (entityFounded) {
      const archetype = this.archetypes[entityFounded.archetypeIndex];
      const moveEntity = archetype.removeComponent(entityFounded.id, component);
      if (moveEntity && moveEntity[1].size > 0) {
        this.migrateEntityToOtherArchetype(
          entityFounded,
          Array.from(moveEntity[1].values())
        );
        this.hasArchetypeChanged = true;
      }
    }
  }

  public removeEntity(entity: Entity) {
    const entityFounded = this.entities.find((ent) => ent.id === entity.id);
    if (entityFounded) {
      const archetype = this.archetypes[entityFounded.archetypeIndex];
      archetype.removeEntity(entityFounded.id);
      this.entities = this.entities.filter((ent) => ent.id !== entity.id);
      this.checkIfArchetypeIsMarkedToRemove(archetype);
      this.hasArchetypeChanged = true;
    }
  }

  private checkIfArchetypeIsMarkedToRemove(archetype: Archetype) {
    if (archetype.entities.length === 0) {
      const index = this.archetypes.indexOf(archetype);
      this.archetypes.splice(index, 1);
      this.entities = this.entities.map((entity) => {
        if (entity.archetypeIndex > index) entity.archetypeIndex--;
        return entity;
      });
    }
  }

  public addSystem<T extends SystemType>(system: T | System) {
    if (typeof system === "function") {
      const systemInstance = new system();
      this.systems.push(systemInstance);
    } else this.systems.push(system);
  }

  public addSystems(...systems: SystemType[]) {
    for (const system of systems) {
      this.addSystem(system);
    }
  }

  public startUp() {
    for (const system of this.systems) {
      system.startUp(this);
    }
  }

  public update() {
    if (this.queryCount >= this.queryActualConsumeHasArchetypeChanged) {
      this.hasArchetypeChanged = false;
      this.queryActualConsumeHasArchetypeChanged = 0;
    }

    this.startAllTaskScheduler();

    for (const system of this.systems) {
      system.update(this);
    }

    if (this.queryCount >= this.queryActualConsumeHasArchetypeChanged)
      this.hasArchetypeChanged = false;
    
  }

  public addTaskScheduler(task: TaskScheduler) {
    this.schedulerSystem.push(task);
  }

  public pauseTaskScheduler(name: string) {
    const task = this.schedulerSystem.find((task) => task.name === name);
    if (task) task.stop();
  }

  public pauseAllTaskScheduler() {
    for (const task of this.schedulerSystem) {
      task.stop();
    }
  }

  public resumeTaskScheduler(name: string) {
    const task = this.schedulerSystem.find((task) => task.name === name);
    if (task) task.resume();
  }

  public startAllTaskScheduler() {
    for (const task of this.schedulerSystem) {
      task.start();
    }
  }

  public startTaskScheduler(name: string) {
    const task = this.schedulerSystem.find((task) => task.name === name);
    if (task) task.start();
  }

  public createQuery<T extends QuerySearchType[]>(...comps: T): Query<T> {
    return new Query(this, ...comps);
  }

  public addPlugin(plugin: IPlugin) {
    plugin.build(this);
  }

  get archetypesModified() {
    return this.hasArchetypeChanged;
  }
}
