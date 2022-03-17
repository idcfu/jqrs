import debounce from '../../helpers/debounce';
import Subject from '../Subject/Subject';
import ITick from '../../types/ITick';
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

  public updateDouble(isDouble: boolean, from: ITick, to: ITick): void {
    if (isDouble) this.toThumb.render();
    else this.toThumb.remove();

    this.updateThumbs(isDouble, from, to);
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

  public updateVertical(
    isDouble: boolean,
    isVertical: boolean,
    scale: false | ITick[],
    from: ITick,
    to: ITick,
  ): void {
    if (isVertical) this.element.classList.add('jqrs_is-vertical');
    else this.element.classList.remove('jqrs_is-vertical');

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

    this.track.subject.attach('trackPointerDown', this.handleTrackPointerDown.bind(this));
    this.fromThumb.subject.attach('fromThumbPointermove', this.handleFromThumbPointermove.bind(this));
    this.toThumb.subject.attach('toThumbPointermove', this.handleToThumbPointermove.bind(this));
    this.progress.subject.attach('progressPointerDown', this.handleProgressPointerDown.bind(this));
    this.scale.subject.attach('scalePointerDown', this.handleScalePointerDown.bind(this));
    window.addEventListener('resize', debounce(this.handleWindowResize.bind(this), 100));
  }

  private handleTrackPointerDown(position: number): void {
    this.subject.notify('viewTrackPointerDown', position);
  }

  private handleFromThumbPointermove(position: number): void {
    this.subject.notify('viewFromThumbPointermove', position);
  }

  private handleToThumbPointermove(position: number): void {
    this.subject.notify('viewToThumbPointermove', position);
  }

  private handleProgressPointerDown(position: number): void {
    this.subject.notify('viewProgressPointerDown', position);
  }

  private handleScalePointerDown(position: number): void {
    this.subject.notify('viewScalePointerDown', position);
  }

  private handleWindowResize(): void {
    this.scale.fitScale();
  }
}

export default View;
