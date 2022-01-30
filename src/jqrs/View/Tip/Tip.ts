class Tip {
  private readonly root;
  private readonly element = document.createElement('div');

  public constructor(root: HTMLElement) {
    this.root = root;
    this.element.className = 'jqrs__tip';
  }

  public render(): void {
    this.root.appendChild(this.element);
  }

  public setValue(value: number): void {
    this.element.innerText = String(value);
  }

  public remove(): void {
    this.element.remove();
  }
}

export default Tip;
