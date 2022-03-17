import Subject from '../../Subject/Subject';

class Track {
  public subject;
  public isVertical = false;

  private root;
  private element = document.createElement('div');

  public constructor(subject: Subject, root: HTMLElement) {
    this.subject = subject;
    this.root = root;

    this.initialize();
  }

  private initialize(): void {
    this.element.classList.add('jqrs__track');
    this.element.addEventListener('pointerdown', this.handleTrackPointerDown.bind(this));
    this.root.append(this.element);
  }

  private handleTrackPointerDown({ clientX, clientY }: PointerEvent): void {
    const rootDOMRect = this.root.getBoundingClientRect();
    let positionPercentage;

    if (this.isVertical) {
      const position = clientY - rootDOMRect.top;
      positionPercentage = 100 - (100 / (rootDOMRect.height / position));
    } else {
      const position = clientX - rootDOMRect.left;
      positionPercentage = 100 / (rootDOMRect.width / position);
    }

    this.subject.notify('trackPointerDown', positionPercentage);
  }
}

export default Track;
