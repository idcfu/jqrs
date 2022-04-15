import { debounce } from '../../helpers/helpers';
import { ITick } from '../../types/types';
import ISubject from '../Subject/ISubject';
import IView from './IView';
import IProgress from './Progress/IProgress';
import IScale from './Scale/IScale';
import IThumb from './Thumb/IThumb';
import ITip from './Tip/ITip';
import ITrack from './Track/ITrack';

class View implements IView {
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
    subject: ISubject,
    element: HTMLElement,
    track: ITrack,
    fromThumb: IThumb,
    toThumb: IThumb,
    fromTip: ITip,
    toTip: ITip,
    progress: IProgress,
    scale: IScale,
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

    this.track.subject.attach('trackPointerdown', this.handleTrackPointerdown.bind(this));
    this.fromThumb.subject.attach('fromThumbPointermove', this.handleFromThumbPointermove.bind(this));
    this.toThumb.subject.attach('toThumbPointermove', this.handleToThumbPointermove.bind(this));
    this.progress.subject.attach('progressPointerdown', this.handleProgressPointerdown.bind(this));
    this.scale.subject.attach('scalePointerdown', this.handleScalePointerdown.bind(this));
    window.addEventListener('resize', debounce(this.handleWindowResize.bind(this), 100));
  }

  private handleTrackPointerdown(position: number): void {
    this.subject.notify('viewTrackPointerdown', position);
  }

  private handleFromThumbPointermove(position: number): void {
    this.subject.notify('viewFromThumbPointermove', position);
  }

  private handleToThumbPointermove(position: number): void {
    this.subject.notify('viewToThumbPointermove', position);
  }

  private handleProgressPointerdown(position: number): void {
    this.subject.notify('viewProgressPointerdown', position);
  }

  private handleScalePointerdown(position: number): void {
    this.subject.notify('viewScalePointerdown', position);
  }

  private handleWindowResize(): void {
    this.scale.fit();
  }
}

export default View;
