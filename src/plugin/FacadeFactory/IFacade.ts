import { IUpdate } from '../../types/types';

interface IFacade {
  setUpdate(update: IUpdate): void;
  unsetUpdate(): void;
  setMin(min: number): void;
  setMax(max: number): void;
  setStep(step: number): void;
  setFrom(from: number): void;
  setTo(to: number): void;
  setIsDouble(isDouble: boolean): void;
  setHasTip(hasTip: boolean): void;
  setHasScale(hasScale: boolean): void;
  setIsVertical(isVertical: boolean): void;
}

export default IFacade;
