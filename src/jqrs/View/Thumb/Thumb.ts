import Observable from '../../Observable/Observable';

class Thumb {
  public move;
  public element = document.createElement('div');

  private root;
  private rootDOMRect;
  private isVertical = false;

  public constructor(move: Observable, root: HTMLElement) {
    this.move = move;
    this.root = root;
    this.rootDOMRect = root.getBoundingClientRect();

    this.initialize();
  }

  public render(): void {
    this.root.append(this.element);
  }

  public remove(): void {
    this.element.remove();
  }

  public setRootDOMRect(rootDOMRect: DOMRect): void {
    this.rootDOMRect = rootDOMRect;
  }

  public setIsVertical(isVertical: boolean): void {
    this.isVertical = isVertical;
  }

  public setPosition(position: number): void {
    if (this.isVertical) {
      this.element.style.left = '';
      this.element.style.bottom = `${position}%`;
    } else {
      this.element.style.bottom = '';
      this.element.style.left = `${position}%`;
    }
  }

  private initialize(): void {
    const { element } = this;

    element.classList.add('jqrs__thumb');
    element.addEventListener('mousedown', this.handleThumbMousedown);
  }

  private handleThumbMousedown = (): void => {
    document.addEventListener('mousemove', this.handleDocumentMousemove);
    document.addEventListener('mouseup', this.handleDocumentMouseup.bind(this), { once: true });
  };

  private handleDocumentMousemove = ({ clientX, clientY }: MouseEvent): void => {
    const { move, rootDOMRect, isVertical } = this;
    const { top, left, width, height } = rootDOMRect;

    let positionPercentage;

    if (isVertical) {
      const position = clientY - top;
      positionPercentage = 100 - (100 / (height / position));
    } else {
      const position = clientX - left;
      positionPercentage = 100 / (width / position);
    }

    move.notify(positionPercentage);
  };

  private handleDocumentMouseup(): void {
    document.removeEventListener('mousemove', this.handleDocumentMousemove);
  }
}

export default Thumb;
