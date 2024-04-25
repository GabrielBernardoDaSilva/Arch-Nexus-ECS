import { World } from "./world";
export type PluginType = new () => IPlugin;
export interface IPlugin {
    build(world: World): void;
}
