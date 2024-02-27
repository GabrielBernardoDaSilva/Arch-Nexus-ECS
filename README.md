<h1>Arch-Nexus-ECS</h1>

<div style="display: flex;justify-content: center; align-items: center;">
    <img src="./arch-nexus.png" width="200" height="200"></img>
</div>

<p>Arch-Nexus-ECS is a lightweight and efficient Entity Component System (ECS) engine designed for TypeScript. It provides a flexible architecture for building scalable and maintainable applications, especially suited for game development, simulations, and data-intensive applications.</p>

<h2>Features</h2>

<ul>
  <li><strong>Entity-Component-System Architecture</strong>: Utilizes the ECS pattern to manage entities, components, and systems, enabling efficient data-oriented design.</li>
  <li><strong>TypeScript Support</strong>: Developed specifically for TypeScript, leveraging strong typing for improved code quality and developer experience.</li>
  <li><strong>Flexible Entity Management</strong>: Allows dynamic creation, destruction, and querying of entities, supporting complex entity hierarchies and relationships.</li>
  <li><strong>Component-Based Composition</strong>: Enables modular development through components, facilitating code reuse and separation of concerns.</li>
  <li><strong>Efficient System Processing</strong>: Optimized system execution through selective processing of entities based on component requirements, maximizing performance.</li>
  <li><strong>Extensible Design</strong>: Designed with extensibility in mind, allowing developers to easily extend functionality through custom components, systems, and utilities.</li>
  <li><strong>Documentation and Examples</strong>: Comprehensive documentation and examples to aid developers in understanding and utilizing the engine effectively.</li>
</ul>

<h2>Installation</h2>

<p>You can install Arch-Nexus-ECS via npm:</p>

<pre><code>npm install arch-nexus-ecs
</code></pre>

<h2>Usage</h2>

<pre><code>
import { Entity } from "./archetype";
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
  query: Query<[typeof Position, typeof Velocity, typeof Entity]>;

  startUp(world: World): void {
    this.query = new Query(world, Position, Velocity, Entity);
    this.query.findFirst();
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

world.startUp();
world.update();

</code></pre>

<h2>License</h2>

<p>Arch-Nexus-ECS is licensed under the MIT License.</p>
