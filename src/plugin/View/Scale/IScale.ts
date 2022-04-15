import { ITick } from '../../../types/types';
import ISubject from '../../Subject/ISubject';

interface IScale {
  subject: ISubject;
  isVertical: boolean;
  render(scale: ITick[]): void;
  remove(): void;
  fit(): void;
}

export default IScale;
