export interface ComponentConfig {
  selector?: string;
  tagName?: string;
  idName?: string;
  className?: string;
}

abstract class ElementBuilder {
  protected element: HTMLElement;

  constructor(config: ComponentConfig) {
    this.element = (config.selector
      ? this.getElementBySelector(config.selector)
      : this.createElement(config.tagName as string, config.idName, config.className)) as HTMLElement;
    this.initialize();
  }

  protected initialize(): void {
    return;
  }

  protected abstract render(): void;

  private createElement(tagName: string, id?: string, className?: string): HTMLElement {
    const element = document.createElement(tagName);
    this.addAttrsToELement(element, id, className);
    return element;
  }

  private addAttrsToELement(element: HTMLElement, id?: string, className?: string) {
    if (id) element.id = id;
    if (className) element.classList.add(className);
  }

  private getElementBySelector(selector: string) {
    return document.querySelector<HTMLElement>(selector);
  }
}

export default ElementBuilder;
