import ITick from '../../../types/ITick';
import Subject from '../../Subject/Subject';

class Scale {
  public subject;
  public isVertical = false;

  private root;
  private element = document.createElement('div');

  public constructor(subject: Subject, root: HTMLElement) {
    this.subject = subject;
    this.root = root;

    this.initialize();
  }

  public render(scale: ITick[]): void {
    this.setScale(scale);
    this.root.append(this.element);
    this.fitScale();
  }

  public remove(): void {
    this.element.remove();
  }

  public fitScale(): void {
    const scale = [...this.element.querySelectorAll('.jqrs__tick')];
    const gapsSize = 10 * (scale.length - 1);

    const scaleSize = scale.reduce(((accumulator, tick) => {
      if (!(tick instanceof HTMLElement)) throw new Error(`'${tick}' is not a HTML element`);

      return accumulator + tick[this.isVertical ? 'offsetHeight' : 'offsetWidth'];
    }), 0) + gapsSize;

    if (scaleSize <= this.root[this.isVertical ? 'clientHeight' : 'clientWidth']) return;

    if (scale.length === 2) {
      scale[0].remove();
      scale[1].remove();
      return;
    }

    for (let index = 1; index < scale.length; index += 2) scale[index].remove();

    this.fitScale();
  }

  private initialize(): void {
    this.element.classList.add('jqrs__scale');
    this.element.addEventListener('pointerdown', this.handleScalePointerDown);
  }

  private handleScalePointerDown = ({ target }: PointerEvent): void => {
    const isTargetTick = target instanceof HTMLElement && target.classList.contains('jqrs__tick');
    if (!isTargetTick) return;

    const position = parseFloat(target.style[this.isVertical ? 'bottom' : 'left']);

    this.subject.notify('scalePointerDown', position);
  };

  private setScale(scale: ITick[]): void {
    let template = '';

    for (let index = 0; index < scale.length; index += 1) {
      template += `
        <div
          class="jqrs__tick"
          style="${this.isVertical ? 'bottom' : 'left'}: ${scale[index].position}%"
        >
          ${scale[index].value}
        </div>
      `;
    }

    this.element.innerHTML = template;
  }
}

export default Scale;
