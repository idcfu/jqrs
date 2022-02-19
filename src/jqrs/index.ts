import ModelFactory from './Model/ModelFactory';
import Presenter from './Presenter/Presenter';
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
    const model = ModelFactory.initialize(options);
    const view = ViewFactory.initialize(this[0]);

    return new Presenter(model, view, update);
  };
}(jQuery));
