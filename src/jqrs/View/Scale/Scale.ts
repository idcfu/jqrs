import Subject from '../../Subject/Subject';
import ITick from '../../types/ITick';

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
    this.fitTicks();
  }

  public remove(): void {
    this.element.remove();
  }

  private initialize(): void {
    this.element.classList.add('jqrs__scale');
    this.element.addEventListener('click', this.handleScaleClick);
  }

  private handleScaleClick = ({ target }: MouseEvent): void => {
    const isTargetTick = target instanceof HTMLElement && target.classList.contains('jqrs__tick');

    if (isTargetTick) {
      const direction = this.isVertical ? 'bottom' : 'left';
      const position = parseFloat(target.style[direction]);

      this.subject.notify('scaleClick', position);
    }
  };

  private setScale(scale: ITick[]): void {
    let template = '';

    for (let index = 0; index < scale.length; index += 1) {
      const { position, value } = scale[index];

      const direction = this.isVertical ? 'bottom' : 'left';
      template += `<div class="jqrs__tick" style="${direction}: ${position}%">${value}</div>`;
    }

    this.element.innerHTML = template;
  }

  private fitTicks(): void {
    const ticks = [...this.element.querySelectorAll('.jqrs__tick')];

    const dimension = this.isVertical ? 'clientHeight' : 'clientWidth';
    const halfMin = ticks[0][dimension] / 2;
    const halfMax = ticks[ticks.length - 1][dimension] / 2;
    const gapsSize = 10 * (ticks.length - 1) - halfMin - halfMax;

    const ticksSize = ticks.reduce(((accumulator, tick) => (
      accumulator + tick[dimension]
    )), 0) + gapsSize;

    if (ticksSize > this.root[dimension]) {
      if (ticks.length === 2) {
        ticks[0].remove();
        ticks[1].remove();
        return;
      }

      for (let index = 1; index < ticks.length; index += 2) {
        if (index === ticks.length - 1) ticks[index - 1].remove();
        else ticks[index].remove();
      }

      this.fitTicks();
    }
  }
}

export default Scale;
