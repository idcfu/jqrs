import Observable from '../Observable/Observable';
import IOptions from '../types/IOptions';
import ITick from '../types/ITick';

interface IActiveTick {
  tick: ITick;
  index: number;
}

interface IActiveTicks {
  fromTick: IActiveTick;
  toTick: IActiveTick;
}

interface IModel {
  update: Observable;
  options: Required<IOptions>;
  scale: ITick[];
  activeTicks: IActiveTicks;
  initialize(): void;
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

export { IActiveTick, IActiveTicks, IModel };
