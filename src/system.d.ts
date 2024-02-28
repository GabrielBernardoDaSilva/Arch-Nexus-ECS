import { World } from "./world";
export type SystemType = new (...args: unknown[]) => System | System;
export declare abstract class System {
    startUp(world: World): void;
    abstract update(world: World): void;
}
