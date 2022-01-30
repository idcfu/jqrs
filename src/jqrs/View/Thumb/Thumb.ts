import Observable from '../../Observable/Observable';

class Thumb {
  public readonly observable;
  public readonly element = document.createElement('div');

  private readonly root;

  public constructor(observable: Observable, root: HTMLElement) {
    this.observable = observable;
    this.root = root;
    this.element.className = 'jqrs__thumb';
    this.addEventListener();
  }

  public render(): void {
    this.root.appendChild(this.element);
  }

  public setPosition(position: number): void {
    this.element.style.left = `${position}%`;
  }

  private addEventListener(): void {
    this.element.addEventListener('mousedown', this.handleThumbMousedown);
  }

  private handleThumbMousedown = (): void => {
    document.addEventListener('mousemove', this.handleDocumentMousemove);
    document.addEventListener('mouseup', this.handleDocumentMouseup.bind(this), { once: true });
  };

  private handleDocumentMousemove = ({ clientX }: MouseEvent): void => {
    const { right, left, width } = this.root.getBoundingClientRect();

    if (clientX < left || clientX > right) return;

    const position = clientX - left;
    const positionPercentage = 100 / (width / position);

    this.observable.notify('handleDocumentMousemove', positionPercentage);
  };

  private handleDocumentMouseup(): void {
    document.removeEventListener('mousemove', this.handleDocumentMousemove);
  }
}

export default Thumb;
