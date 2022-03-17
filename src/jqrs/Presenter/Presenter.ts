import IUpdate from '../../types/IUpdate';
import IModel from '../Model/IModel';
import View from '../View/View';

class Presenter {
  private model;
  private view;
  private update: IUpdate | undefined;

  public constructor(model: IModel, view: View, update?: IUpdate) {
    this.model = model;
    this.view = view;
    this.update = update;

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
    this.model.subject.attach('optionsUpdate', this.handleOptionsUpdate.bind(this));
    this.model.subject.attach('isDoubleUpdate', this.handleIsDoubleUpdate.bind(this));
    this.model.subject.attach('hasTipUpdate', this.handleHasTipUpdate.bind(this));
    this.model.subject.attach('isVerticalUpdate', this.handleIsVerticalUpdate.bind(this));
    this.model.subject.attach('scaleUpdate', this.handleScaleUpdate.bind(this));
    this.model.subject.attach('activeTicksUpdate', this.handleActiveTicksUpdate.bind(this));

    this.view.subject.attach('viewTrackPointerDown', this.handleViewTrackPointerDown.bind(this));
    this.view.subject.attach('viewFromThumbPointermove', this.handleViewFromThumbPointerDown.bind(this));
    this.view.subject.attach('viewToThumbPointermove', this.handleViewToThumbPointerDown.bind(this));
    this.view.subject.attach('viewProgressPointerDown', this.handleViewProgressPointerDown.bind(this));
    this.view.subject.attach('viewScalePointerDown', this.handleViewScalePointerDown.bind(this));

    this.model.initialize();
  }

  private handleOptionsUpdate(): void {
    if (this.update) this.update(this.model.options);
  }

  private handleIsDoubleUpdate(): void {
    this.view.updateDouble(
      this.model.options.isDouble,
      this.model.activeTicks.from.tick,
      this.model.activeTicks.to.tick,
    );
  }

  private handleHasTipUpdate(): void {
    this.view.updateTip(this.model.options.hasTip);
  }

  private handleIsVerticalUpdate(): void {
    this.view.updateVertical(
      this.model.options.isDouble,
      this.model.options.isVertical,
      this.model.options.hasScale && this.model.scale,
      this.model.activeTicks.from.tick,
      this.model.activeTicks.to.tick,
    );
  }

  private handleScaleUpdate(): void {
    this.view.updateScale(this.model.options.hasScale && this.model.scale);
  }

  private handleActiveTicksUpdate(): void {
    this.view.updateThumbs(
      this.model.options.isDouble,
      this.model.activeTicks.from.tick,
      this.model.activeTicks.to.tick,
    );
  }

  private handleViewTrackPointerDown(position: number): void {
    this.model.setActiveTick(position);
  }

  private handleViewFromThumbPointerDown(position: number): void {
    this.model.setFrom(position, 'position');
  }

  private handleViewToThumbPointerDown(position: number): void {
    this.model.setTo(position, 'position');
  }

  private handleViewProgressPointerDown(position: number): void {
    this.model.setActiveTick(position);
  }

  private handleViewScalePointerDown(position: number): void {
    this.model.setActiveTickFromExactPosition(position);
  }
}

export default Presenter;
