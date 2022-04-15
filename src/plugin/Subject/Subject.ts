import { IEventName } from '../../types/types';
import ISubject from './ISubject';

class Subject implements ISubject {
  private events: Record<IEventName, Function[]> = {
    activeTicksUpdate: [],
    fromThumbPointermove: [],
    hasTipUpdate: [],
    isDoubleUpdate: [],
    isVerticalUpdate: [],
    optionsUpdate: [],
    progressPointerdown: [],
    scalePointerdown: [],
    scaleUpdate: [],
    toThumbPointermove: [],
    trackPointerdown: [],
    viewFromThumbPointermove: [],
    viewProgressPointerdown: [],
    viewScalePointerdown: [],
    viewToThumbPointermove: [],
    viewTrackPointerdown: [],
  };

  public attach(type: IEventName, observer: Function): void {
    this.events[type].push(observer);
  }

  public detach(type: IEventName, observer: Function): void {
    this.events[type] = this.events[type].filter((currentObserver) => currentObserver !== observer);
  }

  public notify(type: IEventName, data?: number): void {
    this.events[type].forEach((observer) => observer(data));
  }
}

export default Subject;
