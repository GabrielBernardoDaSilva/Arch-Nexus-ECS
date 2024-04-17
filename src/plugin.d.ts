import { World } from "./world";

export declare interface IPlugin {
  build(world: World): void;
}
