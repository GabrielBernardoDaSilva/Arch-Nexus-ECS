import { World } from "./world";

export interface IPlugin {
  build(world: World): void;
}
