import Observable from '../../Observable/Observable';
import ITick from '../../types/ITick';

class Scale {
  public readonly observable;

  private readonly root;
  private readonly element = document.createElement('div');

  public constructor(observable: Observable, root: HTMLElement) {
    this.observable = observable;
    this.root = root;
    this.element.className = 'jqrs__scale';
  }

  public render(ticks: ITick[]): void {
    this.createTicks(ticks);
    this.root.appendChild(this.element);
  }

  private createTicks(ticks: ITick[]): void {
    let template = '';

    for (let index = 0; index < ticks.length; index += 1) {
      const { position, value } = ticks[index];
      template += `<div class="jqrs__tick" style="left: ${position}%">${value}</div>`;
    }

    this.element.innerHTML = template;
  }
}

export default Scale;
