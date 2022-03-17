type IType =
  'activeTicksUpdate'
  | 'fromThumbPointermove'
  | 'hasTipUpdate'
  | 'isDoubleUpdate'
  | 'isVerticalUpdate'
  | 'optionsUpdate'
  | 'progressPointerDown'
  | 'scalePointerDown'
  | 'scaleUpdate'
  | 'toThumbPointermove'
  | 'trackPointerDown'
  | 'viewFromThumbPointermove'
  | 'viewProgressPointerDown'
  | 'viewScalePointerDown'
  | 'viewToThumbPointermove'
  | 'viewTrackPointerDown';

class Subject {
  private events: Record<IType, Function[]> = {
    activeTicksUpdate: [],
    fromThumbPointermove: [],
    hasTipUpdate: [],
    isDoubleUpdate: [],
    isVerticalUpdate: [],
    optionsUpdate: [],
    progressPointerDown: [],
    scalePointerDown: [],
    scaleUpdate: [],
    toThumbPointermove: [],
    trackPointerDown: [],
    viewFromThumbPointermove: [],
    viewProgressPointerDown: [],
    viewScalePointerDown: [],
    viewToThumbPointermove: [],
    viewTrackPointerDown: [],
  };

  public attach(type: IType, callback: Function): void {
    this.events[type].push(callback);
  }

  public notify(type: IType, data?: number): void {
    this.events[type].forEach((callback) => callback(data));
  }
}

export default Subject;
