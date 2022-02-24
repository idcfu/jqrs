import IModel from '../Model/IModel';
import View from '../View/View';
import IUpdate from '../types/IUpdate';

class Presenter {
  private static update: IUpdate | undefined;
  private model;
  private view;

  public constructor(model: IModel, view: View, update?: IUpdate) {
    Presenter.update = update;
    this.model = model;
    this.view = view;

    this.initialize();
  }

  public setMin(min: number): void {
    this.model.setMin(min);
  }

  public setMax(max: number): void {
    this.model.setMax(max);
  }

  public setStep(step: number): void {
    this.model.setStep(step);
  }

  public setFrom(from: number): void {
    this.model.setFrom(from, 'value');
  }

  public setTo(to: number): void {
    this.model.setTo(to, 'value');
  }

  public setIsDouble(isDouble: boolean): void {
    this.model.setIsDouble(isDouble);
  }

  public setHasTip(hasTip: boolean): void {
    this.model.setHasTip(hasTip);
  }

  public setHasScale(hasScale: boolean): void {
    this.model.setHasScale(hasScale);
  }

  public setIsVertical(isVertical: boolean): void {
    this.model.setIsVertical(isVertical);
  }

  private initialize(): void {
    this.setObservers();
    this.model.initialize();
  }

  private setObservers(): void {
    const { model, view } = this;

    model.optionsUpdate.attach(this.updateOptions.bind(this));
    model.scaleUpdate.attach(this.updateScale.bind(this));
    model.activeTicksUpdate.attach(this.updateThumbs.bind(this));
    view.trackClick.attach(this.setActiveTick.bind(this));
    view.fromThumbMove.attach(this.setFromFromPosition.bind(this));
    view.toThumbMove.attach(this.setToFromPosition.bind(this));
    view.scaleClick.attach(this.setActiveTickFromExactPosition.bind(this));
  }

  private updateOptions(): void {
    const { model, view } = this;
    const { options } = model;
    const { isDouble, hasTip, isVertical } = options;

    if (Presenter.update) Presenter.update(options);
    view.updateOptions({ isDouble, hasTip, isVertical });
  }

  private updateScale(): void {
    const { model, view } = this;
    const {
      options: {
        hasScale,
      },
      scale,
    } = model;

    view.updateScale(hasScale, scale);
  }

  private updateThumbs(): void {
    const { model, view } = this;
    const { fromTick, toTick } = model.activeTicks;

    view.updateThumbs(fromTick.tick, toTick.tick);
  }

  private setActiveTick(position: number): void {
    this.model.setActiveTick(position);
  }

  private setFromFromPosition(position: number): void {
    this.model.setFrom(position, 'position');
  }

  private setToFromPosition(position: number): void {
    this.model.setTo(position, 'position');
  }

  private setActiveTickFromExactPosition(position: number): void {
    this.model.setActiveTickFromExactPosition(position);
  }
}

export default Presenter;
