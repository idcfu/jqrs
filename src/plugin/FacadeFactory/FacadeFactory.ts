import { IUpdate } from '../../types/types';
import IModel from '../Model/IModel';
import IFacade from './IFacade';

class FacadeFactory {
  public static initialize(model: IModel): IFacade {
    let savedUpdate: IUpdate | null;

    const updateOptions = function (): void {
      if (savedUpdate) savedUpdate(model.options);
    };

    return {
      setUpdate(update: IUpdate): IFacade {
        savedUpdate = update;

        model.subject.attach('optionsUpdate', updateOptions);
        model.subject.notify('optionsUpdate');

        return this;
      },

      unsetUpdate(): IFacade {
        savedUpdate = null;

        model.subject.detach('optionsUpdate', updateOptions);

        return this;
      },

      setMin(min: number): IFacade {
        model.setMin(min);

        return this;
      },

      setMax(max: number): IFacade {
        model.setMax(max);

        return this;
      },

      setStep(step: number): IFacade {
        model.setStep(step);

        return this;
      },

      setFrom(from: number): IFacade {
        model.setFrom(from, 'value');

        return this;
      },

      setTo(to: number): IFacade {
        model.setTo(to, 'value');

        return this;
      },

      setIsDouble(isDouble: boolean): IFacade {
        model.setIsDouble(isDouble);

        return this;
      },

      setHasTip(hasTip: boolean): IFacade {
        model.setHasTip(hasTip);

        return this;
      },

      setHasScale(hasScale: boolean): IFacade {
        model.setHasScale(hasScale);

        return this;
      },

      setIsVertical(isVertical: boolean): IFacade {
        model.setIsVertical(isVertical);

        return this;
      },
    };
  }
}

export default FacadeFactory;
