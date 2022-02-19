import Observable from '../Observable/Observable';
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
  }
}

export default View;
