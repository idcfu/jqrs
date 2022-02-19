import { IModel } from '../Model/types';
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
    this.model.update.attach(this.update.bind(this));
    this.model.initialize();
  }

  private update(): void {
    if (Presenter.update) Presenter.update(this.model.options);
  }
}

export default Presenter;
