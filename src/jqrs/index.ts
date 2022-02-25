import Model from './Model/Model';
import Presenter from './Presenter/Presenter';
import Subject from './Subject/Subject';
import ViewFactory from './View/ViewFactory';
import IOptions from './types/IOptions';
import IUpdate from './types/IUpdate';

declare global {
  interface JQuery {
    jqrs(options: IOptions, update?: IUpdate): Presenter;
  }
}

// eslint-disable-next-line @typescript-eslint/no-shadow
(function $($): void {
  const { fn } = $;
  fn.jqrs = function jqrs(options: IOptions, update?: IUpdate): Presenter {
    const subject = new Subject();
    const model = new Model(subject, options);
    const view = ViewFactory.initialize(subject, this[0]);

    return new Presenter(model, view, update);
  };
}(jQuery));
