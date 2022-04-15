import { IActiveTicks, IOptions, ITick } from '../../types/types';
import ISubject from '../Subject/ISubject';

interface IModel {
  subject: ISubject;
  options: Required<IOptions>;
  scale: ITick[];
  activeTicks: IActiveTicks;
  initialize(): void;
  setMin(min: number): void;
  setMax(max: number): void;
  setStep(step: number): void;
  setFrom(from: number, tickKey: keyof ITick): void;
  setTo(to: number, tickKey: keyof ITick): void;
  setIsDouble(isDouble: boolean): void;
  setHasTip(hasTip: boolean): void;
  setHasScale(hasScale: boolean): void;
  setIsVertical(isVertical: boolean): void;
  setActiveTick(position: number): void;
  setActiveTickFromExactPosition(position: number): void;
}

export default IModel;
