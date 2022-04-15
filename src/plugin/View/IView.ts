import { ITick } from '../../types/types';
import ISubject from '../Subject/ISubject';

interface IView {
  subject: ISubject;
  updateDouble(isDouble: boolean, from: ITick, to: ITick): void;
  updateTip(hasTip: boolean): void;
  updateVertical(
    isDouble: boolean,
    isVertical: boolean,
    scale: false | ITick[],
    from: ITick,
    to: ITick,
  ): void;

  updateScale(scale: false | ITick[]): void;
  updateThumbs(isDouble: boolean, from: ITick, to: ITick): void;
}

export default IView;
