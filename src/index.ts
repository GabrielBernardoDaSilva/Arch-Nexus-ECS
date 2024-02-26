import { Archetype, Entity } from "./archetype";
import { Component } from "./component";
import { Query } from "./query";

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

const archetypes = [];
const entity = 1;
const archetype = new Archetype(entity, new Position(1, 1));
const entity3 = 3;
archetype.addNewEntity(entity3, new Position(1, 3));
const res = archetype.hasComponentType(Position);

archetypes.push(archetype);

const entity2 = 2;
const res1 = archetype.hasAllComponents(Velocity, Position);
if (!res1) {
  const archetype2 = new Archetype(
    entity2,
    new Position(1, 2),
    new Velocity(1, 2)
  );
  const res2 = archetype2.hasAllComponents(Velocity, Position);
  archetypes.push(archetype2);

  console.log(res2);
}

const query = new Query([Position, Entity]);
const result = query.findAll(...archetypes);
const e = query.convertToType<[Entity, Position]>(result);
for (const res of e) {
  const [pos, ent] = res;
  
  console.log(pos, ent);
}

console.log(res, res1);
