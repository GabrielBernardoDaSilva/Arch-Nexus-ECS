/// System class
/// This class is the base class for all systems in the game
/// A system is a class that is responsible for updating the game state.
/// The system will have an update method that will be called every frame.
/// The update method will take a list of archetypes as an argument.
/// The system will then be responsible for updating the entities in the archetypes.
import { World } from "./world";

export type SystemType = new (...args: unknown[]) => System | System;
export class System {
  startUp(world: World): void {}
  update(world: World): void {}
  destroy(world: World): void {}
}
