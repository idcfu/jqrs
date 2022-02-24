import Observable from '../../Observable/Observable';
import ITick from '../../types/ITick';

class Scale {
  public click;

  private root;
  private element = document.createElement('div');
  private isVertical = false;

  public constructor(click: Observable, root: HTMLElement) {
    this.click = click;
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

  public setIsVertical(isVertical: boolean): void {
    this.isVertical = isVertical;
  }

  private initialize(): void {
    const { element } = this;

    element.classList.add('jqrs__scale');
    element.addEventListener('click', this.handleScaleClick);
  }

  private handleScaleClick = ({ target }: MouseEvent): void => {
    const isTargetTick = target instanceof HTMLElement && target.classList.contains('jqrs__tick');

    if (isTargetTick) this.click.notify(parseFloat(target.style[this.isVertical ? 'bottom' : 'left']));
  };

  private setScale(scale: ITick[]): void {
    let template = '';

    for (let index = 0; index < scale.length; index += 1) {
      const { position, value } = scale[index];

      template += `<div class="jqrs__tick" style="${this.isVertical ? 'bottom' : 'left'}: ${position}%">${value}</div>`;
    }

    this.element.innerHTML = template;
  }

  private fitTicks(): void {
    const ticks = [...this.element.querySelectorAll('.jqrs__tick')];

    const halfMin = ticks[0][this.isVertical ? 'clientHeight' : 'clientWidth'] / 2;
    const halfMax = ticks[ticks.length - 1][this.isVertical ? 'clientHeight' : 'clientWidth'] / 2;
    const gapsWidth = 10 * (ticks.length - 1) - halfMin - halfMax;

    const ticksWidth = ticks.reduce(((prev, next) => prev + next[this.isVertical ? 'clientHeight' : 'clientWidth']), 0) + gapsWidth;

    if (ticksWidth > this.root[this.isVertical ? 'offsetHeight' : 'offsetWidth']) {
      if (ticks.length === 2) {
        ticks[0].remove();
        ticks[1].remove();
        return;
      }

      for (let index = 1; index < ticks.length; index += 2) {
        if (index !== ticks.length - 1) ticks[index].remove();
        else ticks[index - 1].remove();
      }

      this.fitTicks();
    }
  }
}

export default Scale;
