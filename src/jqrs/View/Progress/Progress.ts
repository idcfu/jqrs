import Observable from '../../Observable/Observable';

class Progress {
  public click;

  private root;
  private rootDOMRect;
  private element = document.createElement('div');
  private isDouble = false;
  private isVertical = false;

  public constructor(click: Observable, root: HTMLElement) {
    this.click = click;
    this.root = root;
    this.rootDOMRect = root.getBoundingClientRect();

    this.initialize();
  }

  public setRootDOMRect(rootDOMRect: DOMRect): void {
    this.rootDOMRect = rootDOMRect;
  }

  public setIsVertical(isVertical: boolean): void {
    this.isVertical = isVertical;
  }

  public setPosition(from: number, to: number): void {
    if (this.isVertical) {
      this.element.style.bottom = `${from}%`;
      this.element.style.top = `${to}%`;
    } else {
      this.element.style.left = `${from}%`;
      this.element.style.right = `${to}%`;
    }
  }

  private initialize(): void {
    const { root, element } = this;

    element.classList.add('jqrs__progress');
    element.addEventListener('click', this.handleProgressClick.bind(this));
    root.append(element);
  }

  private handleProgressClick({ clientX, clientY }: MouseEvent): void {
    const { click, rootDOMRect } = this;
    const { top, left, width, height } = rootDOMRect;

    let positionPercentage;

    if (this.isVertical) {
      const position = clientY - top;
      positionPercentage = 100 - (100 / (height / position));
    } else {
      const position = clientX - left;
      positionPercentage = 100 / (width / position);
    }

    click.notify(positionPercentage);
  }
}

export default Progress;
