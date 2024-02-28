export declare abstract class Component {
}
export declare class ComponentList {
    components: Component[];
    addComponent(component: Component): void;
    addComponents(...components: Component[]): void;
    removeComponent(index: number): void;
}
