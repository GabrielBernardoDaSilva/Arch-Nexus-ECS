import { World } from "./world";
export type SystemType = new (...args: unknown[]) => System | System;
export declare class System {
    world: World;
    startUp(world: World): void;
    update(world: World): void;
    destroy(world: World): void;
}
