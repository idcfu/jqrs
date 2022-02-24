import Observable from '../Observable/Observable';
import View from './View';
import Progress from './Progress/Progress';
import Scale from './Scale/Scale';
import Thumb from './Thumb/Thumb';
import Tip from './Tip/Tip';
import Track from './Track/Track';

class ViewFactory {
  public static initialize(element: HTMLElement): View {
    const track = new Track(new Observable(), element);
    const fromThumb = new Thumb(new Observable(), element);
    const toThumb = new Thumb(new Observable(), element);
    const fromTip = new Tip(fromThumb.element);
    const toTip = new Tip(toThumb.element);
    const progress = new Progress(new Observable(), element);
    const scale = new Scale(new Observable(), element);

    return new View(
      new Observable(),
      new Observable(),
      new Observable(),
      new Observable(),
      element,
      track,
      fromThumb,
      toThumb,
      fromTip,
      toTip,
      progress,
      scale,
    );
  }
}

export default ViewFactory;
