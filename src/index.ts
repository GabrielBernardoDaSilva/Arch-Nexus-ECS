import { Archetype, Entity } from "./archetype";
import { Component } from "./component";
import { Query } from "./query";
import { System } from "./system";
import { World } from "./world";

class Position extends Component {
  constructor(public x: number, public y: number) {
    super();
  }
}

class Velocity extends Component {
  constructor(public dx: number, public dy: number) {
    super();
  }
}

class Health extends Component {
  constructor(public hp: number) {
    super();
  }
}

type QueryResult = [Position, Velocity, Entity];

class PrintSystem extends System {
  query = new Query(Position, Velocity, Entity);

  startUp(world: World): void {
    this.query.findAll(world);
  }

  update(world: World) {
    const result = this.query.resolveQueryResultTypeMapper<QueryResult>();
    console.table(result);
  }
}

const world = new World();
const entity = world.addEntity(new Position(0, 0), new Velocity(1, 1));
const entity2 = world.addEntity(new Position(1, 1));
world.addEntity(new Position(2, 2), new Velocity(2, 2), new Health(100));
world.addEntity(new Position(3, 3), new Velocity(3, 3), new Health(100));

world.addComponentToEntity(entity, new Health(100));
world.removeComponentFromEntity(entity, Velocity);

world.addComponentToEntity(entity2, new Velocity(1, 1));
{
  const query = new Query(Health, Entity);
  const result: [Health, Entity][] = query
    .findAll(world)
    .resolveQueryResultTypeMapper();
  console.table(result);
}
{
  const query = new Query(Velocity, Position, Entity);
  const result: [Velocity, Position, Entity][] = query
    .findAll(world)
    .resolveQueryResultTypeMapper();
  console.table(result);
}
{
  const query = new Query(Entity);
  const result: [Entity][] = query
    .findAll(world)
    .resolveQueryResultTypeMapper();
  console.table(result);
}

{
  const query = new Query(Velocity, Entity);
  const result: [Velocity, Entity][] = query
    .findAll(world)
    .resolveQueryResultTypeMapper();
  console.table(result);
}

console.log(world.archetypes.length);
