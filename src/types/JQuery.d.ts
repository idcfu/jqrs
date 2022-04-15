import IFacade from '../plugin/FacadeFactory/IFacade';
import { IOptions } from './types';

declare global {
  interface JQuery {
    jqrs(options: IOptions): IFacade;
  }
}
