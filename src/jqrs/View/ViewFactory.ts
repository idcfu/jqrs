import Subject from '../Subject/Subject';
import View from './View';
import Progress from './Progress/Progress';
import Scale from './Scale/Scale';
import Thumb from './Thumb/Thumb';
import Tip from './Tip/Tip';
import Track from './Track/Track';

class ViewFactory {
  public static initialize(subject: Subject, element: HTMLElement): View {
    const track = new Track(subject, element);
    const fromThumb = new Thumb(subject, element, 'from');
    const toThumb = new Thumb(subject, element, 'to');
    const fromTip = new Tip(fromThumb.element);
    const toTip = new Tip(toThumb.element);
    const progress = new Progress(subject, element);
    const scale = new Scale(subject, element);

    return new View(
      subject,
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
