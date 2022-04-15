import IModel from '../Model/IModel';
import IView from '../View/IView';

class Presenter {
  private model;
  private view;

  public constructor(model: IModel, view: IView) {
    this.model = model;
    this.view = view;

    this.initialize();
  }

  private initialize(): void {
    this.model.subject.attach('isDoubleUpdate', this.handleIsDoubleUpdate.bind(this));
    this.model.subject.attach('hasTipUpdate', this.handleHasTipUpdate.bind(this));
    this.model.subject.attach('isVerticalUpdate', this.handleIsVerticalUpdate.bind(this));
    this.model.subject.attach('scaleUpdate', this.handleScaleUpdate.bind(this));
    this.model.subject.attach('activeTicksUpdate', this.handleActiveTicksUpdate.bind(this));

    this.view.subject.attach('viewTrackPointerdown', this.handleViewTrackPointerdown.bind(this));
    this.view.subject.attach('viewFromThumbPointermove', this.handleViewFromThumbPointermove.bind(this));
    this.view.subject.attach('viewToThumbPointermove', this.handleViewToThumbPointermove.bind(this));
    this.view.subject.attach('viewProgressPointerdown', this.handleViewProgressPointerdown.bind(this));
    this.view.subject.attach('viewScalePointerdown', this.handleViewScalePointerdown.bind(this));

    this.model.initialize();
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

  private handleViewTrackPointerdown(position: number): void {
    this.model.setActiveTick(position);
  }

  private handleViewFromThumbPointermove(position: number): void {
    this.model.setFrom(position, 'position');
  }

  private handleViewToThumbPointermove(position: number): void {
    this.model.setTo(position, 'position');
  }

  private handleViewProgressPointerdown(position: number): void {
    this.model.setActiveTick(position);
  }

  private handleViewScalePointerdown(position: number): void {
    this.model.setActiveTickFromExactPosition(position);
  }
}

export default Presenter;
