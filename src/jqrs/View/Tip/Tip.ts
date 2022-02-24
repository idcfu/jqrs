class Tip {
  private root;
  private element = document.createElement('div');

  public constructor(root: HTMLElement) {
    this.root = root;

    this.initialize();
  }

  public render(): void {
    this.root.append(this.element);
  }

  public remove(): void {
    this.element.remove();
  }

  public setValue(value: number): void {
    this.element.innerText = String(value);
  }

  private initialize(): void {
    this.element.classList.add('jqrs__tip');
  }
}

export default Tip;
