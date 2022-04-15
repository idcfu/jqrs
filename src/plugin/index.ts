import { importAll } from '../helpers/helpers';
import { IOptions } from '../types/types';
import IFacade from './FacadeFactory/IFacade';
import FacadeFactory from './FacadeFactory/FacadeFactory';
import Model from './Model/Model';
import Presenter from './Presenter/Presenter';
import Subject from './Subject/Subject';
import ViewFactory from './View/ViewFactory';

importAll(require.context('.', true, /\.scss$/));

// eslint-disable-next-line @typescript-eslint/no-shadow
(function $($): void {
  const { fn } = $;

  fn.jqrs = function jqrs(options: IOptions): IFacade {
    if (!(this[0] instanceof HTMLElement)) throw new Error('The root is not a HTML element');

    const subject = new Subject();
    const model = new Model(subject, options);
    const view = ViewFactory.initialize(subject, this[0]);

    new Presenter(model, view);

    return FacadeFactory.initialize(model);
  };
}(jQuery));
