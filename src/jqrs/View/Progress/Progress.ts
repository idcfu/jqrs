import Subject from '../../Subject/Subject';

class Progress {
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

  public setPosition(isDouble: boolean, from: number, to: number): void {
    if (isDouble) this.setPositionHelper(from, to);
    else this.setPositionHelper(0, from);
  }

  private initialize(): void {
    this.element.classList.add('jqrs__progress');
    this.element.addEventListener('click', this.handleProgressClick.bind(this));
    this.root.append(this.element);
  }

  private handleProgressClick({ clientX, clientY }: MouseEvent): void {
    let positionPercentage;

    if (this.isVertical) {
      const position = clientY - this.rootDOMRect.top;
      positionPercentage = 100 - (100 / (this.rootDOMRect.height / position));
    } else {
      const position = clientX - this.rootDOMRect.left;
      positionPercentage = 100 / (this.rootDOMRect.width / position);
    }

    this.subject.notify('progressClick', positionPercentage);
  }

  private setPositionHelper(from: number, to: number): void {
    const newTo = to === 100 ? 0 : 99.9999 - to;

    if (this.isVertical) {
      this.element.style.left = '';
      this.element.style.right = '';
      this.element.style.bottom = `${from}%`;
      this.element.style.top = `${newTo}%`;
    } else {
      this.element.style.bottom = '';
      this.element.style.top = '';
      this.element.style.left = `${from}%`;
      this.element.style.right = `${newTo}%`;
    }
  }
}

export default Progress;
