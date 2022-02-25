import IModel from '../Model/IModel';
import View from '../View/View';
import IUpdate from '../types/IUpdate';

class Presenter {
  private static updateOptions: IUpdate | undefined;
  private model;
  private view;

  public constructor(model: IModel, view: View, update?: IUpdate) {
    Presenter.updateOptions = update;
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
    this.setListeners();
    this.model.initialize();
  }

  private setListeners(): void {
    this.model.subject.attach('optionsUpdate', this.handleOptionsUpdate.bind(this));
    this.model.subject.attach('isDoubleUpdate', this.handleIsDoubleUpdate.bind(this));
    this.model.subject.attach('hasTipUpdate', this.handleHasTipUpdate.bind(this));
    this.model.subject.attach('isVerticalUpdate', this.handleIsVerticalUpdate.bind(this));
    this.model.subject.attach('scaleUpdate', this.handleScaleUpdate.bind(this));
    this.model.subject.attach('activeTicksUpdate', this.handleActiveTicksUpdate.bind(this));

    this.view.subject.attach('viewTrackClick', this.handleViewTrackClick.bind(this));
    this.view.subject.attach('viewFromThumbMove', this.handleViewFromThumbMove.bind(this));
    this.view.subject.attach('viewToThumbMove', this.handleViewToThumbMove.bind(this));
    this.view.subject.attach('viewProgressClick', this.handleViewProgressClick.bind(this));
    this.view.subject.attach('viewScaleClick', this.handleViewScaleClick.bind(this));
  }

  private handleOptionsUpdate(): void {
    if (Presenter.updateOptions) Presenter.updateOptions(this.model.options);
  }

  private handleIsDoubleUpdate(): void {
    const {
      options: {
        isDouble,
      },
      activeTicks: {
        fromTick: {
          tick: {
            position: from,
          },
        },
        toTick: {
          tick: {
            position: to,
          },
        },
      },
    } = this.model;

    this.view.updateDouble(isDouble, from, to);
  }

  private handleHasTipUpdate(): void {
    this.view.updateTip(this.model.options.hasTip);
  }

  private handleIsVerticalUpdate(): void {
    const {
      options: {
        isDouble,
        hasScale,
        isVertical,
      },
      scale: modelScale,
      activeTicks: {
        fromTick: {
          tick: from,
        },
        toTick: {
          tick: to,
        },
      },
    } = this.model;

    const scale = hasScale && modelScale;
    this.view.updateDirection(isDouble, isVertical, scale, from, to);
  }

  private handleScaleUpdate(): void {
    const scale = this.model.options.hasScale && this.model.scale;
    this.view.updateScale(scale);
  }

  private handleActiveTicksUpdate(): void {
    const {
      options: {
        isDouble,
      },
      activeTicks: {
        fromTick: {
          tick: from,
        },
        toTick: {
          tick: to,
        },
      },
    } = this.model;

    this.view.updateThumbs(isDouble, from, to);
  }

  private handleViewTrackClick(position: number): void {
    this.model.setActiveTick(position);
  }

  private handleViewFromThumbMove(position: number): void {
    this.model.setFrom(position, 'position');
  }

  private handleViewToThumbMove(position: number): void {
    this.model.setTo(position, 'position');
  }

  private handleViewProgressClick(position: number): void {
    this.model.setActiveTick(position);
  }

  private handleViewScaleClick(position: number): void {
    this.model.setActiveTickFromExactPosition(position);
  }
}

export default Presenter;
