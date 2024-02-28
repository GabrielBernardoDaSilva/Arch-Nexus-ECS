import { Entity } from "./archetype";
import { Component } from "./component";
import { Query } from "./query";
import { TaskScheduler, WaitAmountOfSeconds } from "./scheduler";
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
  query: Query<[typeof Position, typeof Velocity, typeof Entity]>;

  startUp(world: World): void {
    this.query = new Query(world, Position, Velocity, Entity);
    this.query.findAll();
  }

  update(world: World) {
    const result = this.query.resolveQueryResultTypeMapper<QueryResult>();
    console.table(result);
  }
}

class SpawnSystem extends System {
  startUp(world: World): void {
    const entity = world.addEntity(new Position(0, 0), new Velocity(1, 1));
    const entity2 = world.addEntity(new Position(1, 1));
    world.addEntity(new Position(2, 2), new Velocity(2, 2), new Health(100));
    world.addEntity(new Position(3, 3), new Velocity(3, 3), new Health(100));

    world.addComponentToEntity(entity, new Health(100));
    world.removeComponentFromEntity(entity, Velocity);

    world.addComponentToEntity(entity2, new Velocity(1, 1));
  }

  update(world: World): void {}
}

const world = new World();
world.addSystems(SpawnSystem, PrintSystem);

function* generateId(n1: number, n2: number, n3: number) {
  yield new WaitAmountOfSeconds(n1);
  console.log("GenerateId::1 seconds passed ", new Date().getSeconds());
  yield new WaitAmountOfSeconds(n2);
  console.log("GenerateId::2 seconds passed ", new Date().getSeconds());
  yield new WaitAmountOfSeconds(n3);
  console.log("GenerateId::3 seconds passed ", new Date().getSeconds());
  world.addEntity(new Position(0, 0), new Velocity(7, 7));
}

function* generateId1(n1: number, n2: number, n3: number) {
  yield new WaitAmountOfSeconds(n1);
  console.log("GenerateId1::2 seconds passed ", new Date().getSeconds());
  yield new WaitAmountOfSeconds(n2);
  console.log("GenerateId1::3 seconds passed ", new Date().getSeconds());
  yield new WaitAmountOfSeconds(n3);
  console.log("GenerateId1::4 seconds passed ", new Date().getSeconds());
}

world.addTaskScheduler(new TaskScheduler(generateId, 1, 1, 1));
world.addTaskScheduler(new TaskScheduler(generateId1, 2, 3, 20));
setTimeout(() => {
  world.pauseTaskScheduler("generateId1");
  console.log("Paused generateId1");
}, 5000);

world.startUp();

const recursive = () => {
  world.update();
  setTimeout(recursive, 33);
};

recursive();
