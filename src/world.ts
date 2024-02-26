import { Archetype, Entity, EntityLocation } from "./archetype";
import { Component } from "./component";

export class World {
  archetypes: Archetype[] = [];
  entities: EntityLocation[] = [];

  public addEntity<T extends Component[]>(...components: T): Entity {
    const entityId = this.generateEntityId().next().value as number;

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
    });

    return new Entity(entityId);
  }

  public addComponentToEntity<T extends Component>(
    entity: Entity,
    component: T
  ) {
    const entityFounded = this.entities.find((ent) => ent.id === entity.id);
    if (entity) {
      const archetype = this.archetypes[entityFounded.archetypeIndex];
      archetype.addComponents(entityFounded.id, component);
    }
  }

  private migrateEntityToOtherArchetype<T extends Component>(
    entityId: number,
    components: T[]
  ) {
    const archetypeFounded = this.archetypes.find((archetype) =>
      archetype.hasAllComponentsByString(components)
    );
    let index = this.archetypes.length;
    if (archetypeFounded) {
      index = this.archetypes.indexOf(archetypeFounded);
      archetypeFounded.addNewEntity(entityId, ...components);
    } else {
      const archetype = new Archetype(entityId, ...components);
      this.archetypes.push(archetype);
    }

    const entity = this.entities.find((entity) => entity.id === entityId);
    if (entity) {
      entity.archetypeIndex = index;
    }
  }

  public removeComponentFromEntity<T extends Component>(
    entity: Entity,
    component: T
  ) {
    const entityFounded = this.entities.find((ent) => ent.id === entity.id);

    if (entity) {
      const archetype = this.archetypes[entityFounded.archetypeIndex];
      
      const moveEntity = archetype.removeComponent(entityFounded.id, component);
      if (moveEntity && moveEntity[1].size > 0) {
        this.migrateEntityToOtherArchetype(
          entity.id,
          Array.from(moveEntity[1].values())
        );
      }
    }
  }

  public removeEntity(entity: Entity) {
    const entityFounded = this.entities.find((ent) => ent.id === entity.id);
    if (entityFounded) {
      const archetype = this.archetypes[entityFounded.archetypeIndex];
      archetype.removeEntity(entityFounded.id);
      this.entities = this.entities.filter((ent) => ent.id !== entity.id);
    }
  }

  private *generateEntityId(): Generator<number> {
    let id = 0;
    while (true) {
      yield id++;
    }
  }
}
