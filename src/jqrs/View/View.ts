import Observable from '../Observable/Observable';
import ITick from '../types/ITick';
import Progress from './Progress/Progress';
import Scale from './Scale/Scale';
import Thumb from './Thumb/Thumb';
import Tip from './Tip/Tip';
import Track from './Track/Track';
import './View.scss';

interface IUpdateOptionsData {
  isDouble: boolean;
  hasTip: boolean;
  isVertical: boolean;
}

class View {
  public trackClick;
  public fromThumbMove;
  public toThumbMove;
  public scaleClick;

  private element;
  private track;
  private fromThumb;
  private toThumb;
  private fromTip;
  private toTip;
  private progress;
  private scale;

  public constructor(
    trackClick: Observable,
    fromThumbMove: Observable,
    toThumbMove: Observable,
    scaleClick: Observable,
    element: HTMLElement,
    track: Track,
    fromThumb: Thumb,
    toThumb: Thumb,
    fromTip: Tip,
    toTip: Tip,
    progress: Progress,
    scale: Scale,
  ) {
    this.trackClick = trackClick;
    this.fromThumbMove = fromThumbMove;
    this.toThumbMove = toThumbMove;
    this.scaleClick = scaleClick;
    this.element = element;
    this.track = track;
    this.fromThumb = fromThumb;
    this.toThumb = toThumb;
    this.fromTip = fromTip;
    this.toTip = toTip;
    this.progress = progress;
    this.scale = scale;

    this.initialize();
  }

  public updateOptions({ isDouble, hasTip, isVertical }: IUpdateOptionsData): void {
    const { toThumb, fromTip, toTip } = this;

    if (isDouble) {
      toThumb.render();
    } else toThumb.remove();

    if (hasTip) {
      fromTip.render();
      toTip.render();
    } else {
      fromTip.remove();
      toTip.remove();
    }

    this.setIsVertical(isVertical);
  }

  public updateScale(hasScale: boolean, scale: ITick[]): void {
    if (hasScale) this.scale.render(scale);
    else this.scale.remove();
  }

  public updateThumbs(fromTick: ITick, toTick: ITick): void {
    this.fromThumb.setPosition(fromTick.position);
    this.toThumb.setPosition(toTick.position);

    this.fromTip.setValue(fromTick.value);
    this.toTip.setValue(toTick.value);
  }

  private initialize(): void {
    this.fromThumb.render();
    this.setObservers();
  }

  private setObservers(): void {
    this.track.click.attach(this.handleTrackClick.bind(this));
    this.fromThumb.move.attach(this.handleFromThumbAction.bind(this));
    this.toThumb.move.attach(this.handleToThumbAction.bind(this));
    this.progress.click.attach(this.handleProgressClick.bind(this));
    this.scale.click.attach(this.handleScaleClick.bind(this));
  }

  private handleTrackClick(position: number): void {
    this.trackClick.notify(position);
  }

  private handleFromThumbAction(position: number): void {
    this.fromThumbMove.notify(position);
  }

  private handleToThumbAction(position: number): void {
    this.toThumbMove.notify(position);
  }

  private handleProgressClick(position: number): void {
    this.trackClick.notify(position);
  }

  private handleScaleClick(position: number): void {
    this.scaleClick.notify(position);
  }

  private setIsVertical(isVertical: boolean): void {
    if (isVertical) this.element.classList.add('jqrs_vertical');
    else this.element.classList.remove('jqrs_vertical');

    this.setDORRect();

    this.track.setIsVertical(isVertical);
    this.fromThumb.setIsVertical(isVertical);
    this.toThumb.setIsVertical(isVertical);
    this.progress.setIsVertical(isVertical);
    this.scale.setIsVertical(isVertical);
  }

  private setDORRect(): void {
    const DOMRect = this.element.getBoundingClientRect();

    this.track.setRootDOMRect(DOMRect);
    this.fromThumb.setRootDOMRect(DOMRect);
    this.toThumb.setRootDOMRect(DOMRect);
    this.progress.setRootDOMRect(DOMRect);
  }
}

export default View;
