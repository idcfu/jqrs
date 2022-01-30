import Observable from '../Observable/Observable';
import View from './View';
import Progress from './Progress/Progress';
import Scale from './Scale/Scale';
import Thumb from './Thumb/Thumb';
import Tip from './Tip/Tip';
import Track from './Track/Track';

class ViewFactory {
  public static initialize(element: HTMLElement): View {
    const observable = new Observable();
    const track = new Track(observable, element);
    const thumb = new Thumb(observable, element);
    const tip = new Tip(thumb.element);
    const progress = new Progress(observable, element);
    const scale = new Scale(observable, element);

    return new View(observable, element, track, thumb, tip, progress, scale);
  }
}

export default ViewFactory;
