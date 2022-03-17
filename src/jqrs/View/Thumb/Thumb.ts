import Subject from '../../Subject/Subject';

class Thumb {
  public subject;
  public element = document.createElement('div');
  public isVertical = false;

  private root;
  private type;

  public constructor(subject: Subject, root: HTMLElement, type: 'from' | 'to') {
    this.subject = subject;
    this.root = root;
    this.type = type;

    this.initialize();
  }

  public render(): void {
    this.root.append(this.element);
  }

  public remove(): void {
    this.element.remove();
  }

  public setPosition(position: number): void {
    this.element.style.bottom = this.isVertical ? `${position}%` : '';
    this.element.style.left = this.isVertical ? '' : `${position}%`;
  }

  private initialize(): void {
    this.element.classList.add('jqrs__thumb');
    this.element.addEventListener('pointerdown', this.handleThumbPointerdown.bind(this));
  }

  private handleThumbPointerdown = ({ pointerId }: PointerEvent): void => {
    this.element.classList.add('jqrs__thumb_is-active');
    this.element.addEventListener('pointermove', this.handleThumbPointermove);
    this.element.addEventListener('pointerup', this.handleThumbPointerup.bind(this), { once: true });
    this.element.setPointerCapture(pointerId);
  };

  private handleThumbPointermove = ({ clientX, clientY }: PointerEvent): void => {
    const rootDOMRect = this.root.getBoundingClientRect();
    let positionPercentage;

    if (this.isVertical) {
      const position = clientY - rootDOMRect.top;
      positionPercentage = 100 - (100 / (rootDOMRect.height / position));
    } else {
      const position = clientX - rootDOMRect.left;
      positionPercentage = 100 / (rootDOMRect.width / position);
    }

    this.subject.notify(`${this.type}ThumbPointermove`, positionPercentage);
  };

  private handleThumbPointerup(): void {
    this.element.classList.remove('jqrs__thumb_is-active');
    this.element.removeEventListener('pointermove', this.handleThumbPointermove);
  }
}

export default Thumb;
