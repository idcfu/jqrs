type IType =
  'activeTicksUpdate'
  | 'fromThumbMove'
  | 'hasTipUpdate'
  | 'isDoubleUpdate'
  | 'isVerticalUpdate'
  | 'optionsUpdate'
  | 'progressClick'
  | 'scaleClick'
  | 'scaleUpdate'
  | 'toThumbMove'
  | 'trackClick'
  | 'viewFromThumbMove'
  | 'viewProgressClick'
  | 'viewScaleClick'
  | 'viewToThumbMove'
  | 'viewTrackClick';

class Subject {
  private events: Record<IType, Function[]> = {
    activeTicksUpdate: [],
    fromThumbMove: [],
    hasTipUpdate: [],
    isDoubleUpdate: [],
    isVerticalUpdate: [],
    optionsUpdate: [],
    progressClick: [],
    scaleClick: [],
    scaleUpdate: [],
    toThumbMove: [],
    trackClick: [],
    viewFromThumbMove: [],
    viewProgressClick: [],
    viewScaleClick: [],
    viewToThumbMove: [],
    viewTrackClick: [],
  };

  public attach(type: IType, observer: Function): void {
    this.events[type].push(observer);
  }

  public detach(type: IType, observer: Function): void {
    this.events[type].filter((currentObserver) => currentObserver !== observer);
  }

  public notify(type: IType, data?: number): void {
    this.events[type].forEach((observer) => observer(data));
  }
}

export default Subject;
