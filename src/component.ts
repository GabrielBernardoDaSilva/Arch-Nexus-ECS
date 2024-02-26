export abstract class Component {}

export class ComponentList {
  components: Component[] = [];
  addComponent(component: Component) {
    this.components.push(component);
  }

  addComponents(...components: Component[]) {
    this.components.push(...components);
  }
}
