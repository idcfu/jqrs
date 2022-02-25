import Subject from '../Subject/Subject';
import ITick from '../types/ITick';
import Progress from './Progress/Progress';
import Scale from './Scale/Scale';
import Thumb from './Thumb/Thumb';
import Tip from './Tip/Tip';
import Track from './Track/Track';
import './View.scss';

class View {
  public subject;

  private element;
  private track;
  private fromThumb;
  private toThumb;
  private fromTip;
  private toTip;
  private progress;
  private scale;

  public constructor(
    subject: Subject,
    element: HTMLElement,
    track: Track,
    fromThumb: Thumb,
    toThumb: Thumb,
    fromTip: Tip,
    toTip: Tip,
    progress: Progress,
    scale: Scale,
  ) {
    this.subject = subject;
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

  public updateDouble(isDouble: boolean, from: number, to: number): void {
    if (isDouble) this.toThumb.render();
    else this.toThumb.remove();

    this.progress.setPosition(isDouble, from, to);
  }

  public updateTip(hasTip: boolean): void {
    if (hasTip) {
      this.fromTip.render();
      this.toTip.render();
    } else {
      this.fromTip.remove();
      this.toTip.remove();
    }
  }

  public updateDirection(
    isDouble: boolean,
    isVertical: boolean,
    scale: false | ITick[],
    from: ITick,
    to: ITick,
  ): void {
    if (isVertical) this.element.classList.add('jqrs_vertical');
    else this.element.classList.remove('jqrs_vertical');

    this.setDOMRect();

    this.track.isVertical = isVertical;
    this.fromThumb.isVertical = isVertical;
    this.toThumb.isVertical = isVertical;
    this.progress.isVertical = isVertical;
    this.scale.isVertical = isVertical;

    this.updateScale(scale);
    this.updateThumbs(isDouble, from, to);
  }

  public updateScale(scale: false | ITick[]): void {
    if (scale) this.scale.render(scale);
    else this.scale.remove();
  }

  public updateThumbs(isDouble: boolean, from: ITick, to: ITick): void {
    this.fromThumb.setPosition(from.position);
    this.toThumb.setPosition(to.position);

    this.fromTip.setValue(from.value);
    this.toTip.setValue(to.value);

    this.progress.setPosition(isDouble, from.position, to.position);
  }

  private initialize(): void {
    this.fromThumb.render();
    this.setListeners();
  }

  private setListeners(): void {
    this.track.subject.attach('trackClick', this.handleTrackClick.bind(this));
    this.fromThumb.subject.attach('fromThumbMove', this.handleFromThumbMove.bind(this));
    this.toThumb.subject.attach('toThumbMove', this.handleToThumbMove.bind(this));
    this.progress.subject.attach('progressClick', this.handleProgressClick.bind(this));
    this.scale.subject.attach('scaleClick', this.handleScaleClick.bind(this));
  }

  private handleTrackClick(position: number): void {
    this.subject.notify('viewTrackClick', position);
  }

  private handleFromThumbMove(position: number): void {
    this.subject.notify('viewFromThumbMove', position);
  }

  private handleToThumbMove(position: number): void {
    this.subject.notify('viewToThumbMove', position);
  }

  private handleProgressClick(position: number): void {
    this.subject.notify('viewProgressClick', position);
  }

  private handleScaleClick(position: number): void {
    this.subject.notify('viewScaleClick', position);
  }

  private setDOMRect(): void {
    const DOMRect = this.element.getBoundingClientRect();

    this.track.rootDOMRect = DOMRect;
    this.fromThumb.rootDOMRect = DOMRect;
    this.toThumb.rootDOMRect = DOMRect;
    this.progress.rootDOMRect = DOMRect;
  }
}

export default View;
