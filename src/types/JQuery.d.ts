import Presenter from '../jqrs/Presenter/Presenter';
import IOptions from './IOptions';
import IUpdate from './IUpdate';

declare global {
  interface JQuery {
    jqrs(options: IOptions, update?: IUpdate): Presenter;
  }
}
