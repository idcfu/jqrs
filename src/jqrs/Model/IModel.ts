import Observable from '../Observable/Observable';
import IActiveTicks from '../types/IActiveTicks';
import IOptions from '../types/IOptions';
import ITick from '../types/ITick';

interface IModel {
  optionsUpdate: Observable;
  scaleUpdate: Observable;
  activeTicksUpdate: Observable;
  options: Required<IOptions>;
  scale: ITick[];
  activeTicks: IActiveTicks;
  initialize(): void;
  setActiveTick(position: number): void;
  setActiveTickFromExactPosition(position: number): void;
  setMin(min: number): void;
  setMax(max: number): void;
  setStep(step: number): void;
  setFrom(from: number, type: keyof ITick): void;
  setTo(to: number, type: keyof ITick): void;
  setIsDouble(isDouble: boolean): void;
  setHasTip(hasTip: boolean): void;
  setHasScale(hasScale: boolean): void;
  setIsVertical(isVertical: boolean): void;
}

export default IModel;
