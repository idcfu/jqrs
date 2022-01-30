import Model from '../Model/Model';
import View from '../View/View';
import ITick from '../types/ITick';

class Presenter {
  private readonly model;
  private readonly view;

  public constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.attachAll();

    this.model.calculateTicks();
    this.model.setTip();
    this.model.findClosestTick();
  }

  private attachAll(): void {
    const { observable: observableModel } = this.model;
    const { observable: observableView } = this.view;

    observableModel.attach('calculateTicks', this.renderScale.bind(this));
    observableModel.attach('setTip', this.toggleTip.bind(this));
    observableModel.attach('findClosestTick', this.setPosition.bind(this));
    observableView.attach('handleAction', this.findClosestTick.bind(this));
  }

  private renderScale(ticks: ITick[]): void {
    this.view.renderScale(ticks);
  }

  private toggleTip(hasTip: boolean): void {
    this.view.toggleTip(hasTip);
  }

  private setPosition(tick: ITick): void {
    this.view.setPosition(tick);
  }

  private findClosestTick(position: number): void {
    this.model.findClosestTick(position);
  }
}

export default Presenter;
