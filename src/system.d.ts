import { World } from "./world";
export type SystemType = new (...args: unknown[]) => System | System;
export declare abstract class System {
    startUp(world: World): void;
    update(world: World): void;
    destroy(world: World): void;
}
