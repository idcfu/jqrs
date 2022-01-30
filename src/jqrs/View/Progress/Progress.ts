import Observable from '../../Observable/Observable';

class Progress {
  public readonly observable;

  private readonly root;
  private readonly element = document.createElement('div');

  public constructor(observable: Observable, root: HTMLElement) {
    this.observable = observable;
    this.root = root;
    this.element.className = 'jqrs__progress';
    this.addEventListener();
  }

  public render(): void {
    this.root.appendChild(this.element);
  }

  public setPosition(position: number): void {
    this.element.style.width = `${position}%`;
  }

  private addEventListener(): void {
    this.element.addEventListener('click', this.handleProgressClick.bind(this));
  }

  private handleProgressClick({ clientX }: MouseEvent): void {
    const { left, width } = this.root.getBoundingClientRect();

    const position = clientX - left;
    const positionPercentage = 100 / (width / position);

    this.observable.notify('handleProgressClick', positionPercentage);
  }
}

export default Progress;
