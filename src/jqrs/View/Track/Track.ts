import Subject from '../../Subject/Subject';

class Track {
  public subject;
  public rootDOMRect;
  public isVertical = false;

  private root;
  private element = document.createElement('div');

  public constructor(subject: Subject, root: HTMLElement) {
    this.subject = subject;
    this.root = root;
    this.rootDOMRect = root.getBoundingClientRect();

    this.initialize();
  }

  private initialize(): void {
    this.element.classList.add('jqrs__track');
    this.element.addEventListener('click', this.handleTrackClick.bind(this));
    this.root.append(this.element);
  }

  private handleTrackClick({ clientX, clientY }: MouseEvent): void {
    let positionPercentage;

    if (this.isVertical) {
      const position = clientY - this.rootDOMRect.top;
      positionPercentage = 100 - (100 / (this.rootDOMRect.height / position));
    } else {
      const position = clientX - this.rootDOMRect.left;
      positionPercentage = 100 / (this.rootDOMRect.width / position);
    }

    this.subject.notify('trackClick', positionPercentage);
  }
}

export default Track;
