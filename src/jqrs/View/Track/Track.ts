import Observable from '../../Observable/Observable';

class Track {
  public readonly observable;

  private readonly root;
  private readonly element = document.createElement('div');

  public constructor(observable: Observable, root: HTMLElement) {
    this.observable = observable;
    this.root = root;
    this.element.className = 'jqrs__track';
    this.addEventListener();
  }

  public render(): void {
    this.root.appendChild(this.element);
  }

  private addEventListener(): void {
    this.element.addEventListener('click', this.handleTrackClick.bind(this));
  }

  private handleTrackClick({ clientX }: MouseEvent): void {
    const { left, width } = this.root.getBoundingClientRect();

    const position = clientX - left;
    const positionPercentage = 100 / (width / position);

    this.observable.notify('handleTrackClick', positionPercentage);
  }
}

export default Track;
