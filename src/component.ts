export abstract class Component {}

export class ComponentList {
  components: Component[] = [];
  addComponent(component: Component) {
    this.components.push(component);
  }

  addComponents(...components: Component[]) {
    this.components.push(...components);
  }

  removeComponent(index: number) {
    this.components.splice(index, 1);
  }
}
