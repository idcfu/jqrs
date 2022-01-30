import Observable from '../Observable/Observable';
import ITick from '../types/ITick';
import Progress from './Progress/Progress';
import Scale from './Scale/Scale';
import Thumb from './Thumb/Thumb';
import Tip from './Tip/Tip';
import Track from './Track/Track';
import './View.scss';

class View {
  public readonly observable;

  private readonly element;
  private readonly track;
  private readonly thumb;
  private readonly tip;
  private readonly progress;
  private readonly scale;

  public constructor(
    observable: Observable,
    element: HTMLElement,
    track: Track,
    thumb: Thumb,
    tip: Tip,
    progress: Progress,
    scale: Scale,
  ) {
    this.observable = observable;
    this.element = element;
    this.track = track;
    this.thumb = thumb;
    this.tip = tip;
    this.progress = progress;
    this.scale = scale;

    this.attachAll();
    this.renderOthers();
  }

  public renderScale(ticks: ITick[]): void {
    this.scale.render(ticks);
  }

  public toggleTip(hasTip: boolean): void {
    if (hasTip) this.tip.render();
    else this.tip.remove();
  }

  public setPosition({ position, value }: ITick): void {
    this.thumb.setPosition(position);
    this.tip.setValue(value);
    this.progress.setPosition(position);
  }

  private attachAll(): void {
    this.track.observable.attach('handleTrackClick', this.handleAction.bind(this));
    this.thumb.observable.attach('handleDocumentMousemove', this.handleAction.bind(this));
    this.progress.observable.attach('handleProgressClick', this.handleAction.bind(this));
  }

  private handleAction(position: number): void {
    this.observable.notify('handleAction', position);
  }

  private renderOthers(): void {
    this.track.render();
    this.thumb.render();
    this.progress.render();
  }
}

export default View;
