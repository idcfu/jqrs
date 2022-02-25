import Subject from '../../Subject/Subject';

class Thumb {
  public subject;
  public rootDOMRect;
  public element = document.createElement('div');
  public isVertical = false;

  private root;
  private type;

  public constructor(subject: Subject, root: HTMLElement, type: 'from' | 'to') {
    this.subject = subject;
    this.root = root;
    this.rootDOMRect = root.getBoundingClientRect();
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
    if (this.isVertical) {
      this.element.style.left = '';
      this.element.style.bottom = `${position}%`;
    } else {
      this.element.style.bottom = '';
      this.element.style.left = `${position}%`;
    }
  }

  private initialize(): void {
    this.element.classList.add('jqrs__thumb');
    this.element.addEventListener('mousedown', this.handleThumbMousedown);
  }

  private handleThumbMousedown = (): void => {
    document.addEventListener('mousemove', this.handleDocumentMousemove);
    document.addEventListener('mouseup', this.handleDocumentMouseup.bind(this), { once: true });
  };

  private handleDocumentMousemove = ({ clientX, clientY }: MouseEvent): void => {
    let positionPercentage;

    if (this.isVertical) {
      const position = clientY - this.rootDOMRect.top;
      positionPercentage = 100 - (100 / (this.rootDOMRect.height / position));
    } else {
      const position = clientX - this.rootDOMRect.left;
      positionPercentage = 100 / (this.rootDOMRect.width / position);
    }

    this.subject.notify(`${this.type}ThumbMove`, positionPercentage);
  };

  private handleDocumentMouseup(): void {
    document.removeEventListener('mousemove', this.handleDocumentMousemove);
  }
}

export default Thumb;
