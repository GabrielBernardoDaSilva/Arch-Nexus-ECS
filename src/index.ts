import { Archetype, Entity } from "./archetype";
import { Component } from "./component";
import { Query } from "./query";
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

const world = new World();
const entity = world.addEntity(new Position(0, 0), new Velocity(1, 1));
world.addEntity(new Position(1, 1));

world.removeComponentFromEntity(entity, Velocity);

const query = new Query(Position, Velocity);
const result: [Position, Velocity][] = query
  .findAll(world)
  .resolveQueryResultTypeMapper();
console.table(result);
