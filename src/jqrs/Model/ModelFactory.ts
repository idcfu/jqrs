import Observable from '../Observable/Observable';
import IOptions from '../types/IOptions';
import IModel from './IModel';
import Model from './Model';

class ModelFactory {
  public static initialize(options: IOptions): IModel {
    return new Model(new Observable(), new Observable(), new Observable(), options);
  }
}

export default ModelFactory;
