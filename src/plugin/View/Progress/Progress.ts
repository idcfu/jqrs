import ISubject from '../../Subject/ISubject';
import IProgress from './IProgress';

class Progress implements IProgress {
  public subject;
  public isVertical = false;

  private root;
  private element = document.createElement('div');

  public constructor(subject: ISubject, root: HTMLElement) {
    this.subject = subject;
    this.root = root;

    this.initialize();
  }

  public setPosition(isDouble: boolean, from: number, to: number): void {
    if (isDouble) this.setPositionHelper(from, to);
    else this.setPositionHelper(0, from);
  }

  private initialize(): void {
    this.element.classList.add('jqrs__progress');
    this.element.addEventListener('pointerdown', this.handleProgressPointerdown.bind(this));
    this.root.append(this.element);
  }

  private handleProgressPointerdown({ clientX, clientY }: PointerEvent): void {
    const rootDOMRect = this.root.getBoundingClientRect();
    let positionPercentage;

    if (this.isVertical) {
      const position = clientY - rootDOMRect.top;
      positionPercentage = 100 - (100 / (rootDOMRect.height / position));
    } else {
      const position = clientX - rootDOMRect.left;
      positionPercentage = 100 / (rootDOMRect.width / position);
    }

    this.subject.notify('progressPointerdown', positionPercentage);
  }

  private setPositionHelper(from: number, to: number): void {
    this.element.style.top = this.isVertical ? `${100 - to}%` : '';
    this.element.style.right = this.isVertical ? '' : `${100 - to}%`;
    this.element.style.bottom = this.isVertical ? `${from}%` : '';
    this.element.style.left = this.isVertical ? '' : `${from}%`;
  }
}

export default Progress;
