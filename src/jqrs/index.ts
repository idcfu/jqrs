import Model from './Model/Model';
import Observable from './Observable/Observable';
import Presenter from './Presenter/Presenter';
import ViewFactory from './View/ViewFactory';
import IOptions from './types/IOptions';

declare global {
  interface JQuery {
    jqrs(options: IOptions): void;
  }
}

// eslint-disable-next-line @typescript-eslint/no-shadow
(function $($): void {
  // eslint-disable-next-line no-param-reassign
  $.fn.jqrs = function jqrs(options: IOptions = {}): void {
    for (let index = 0; index < this.length; index += 1) {
      const model = new Model(new Observable(), options);
      const view = ViewFactory.initialize(this[index]);

      // eslint-disable-next-line no-new
      new Presenter(model, view);
    }
  };
}(jQuery));
