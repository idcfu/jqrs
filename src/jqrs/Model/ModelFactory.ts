import Observable from '../Observable/Observable';
import IOptions from '../types/IOptions';
import Model from './Model';
import { IModel } from './types';

class ModelFactory {
  public static initialize(options: IOptions): IModel {
    return new Model(new Observable(), options);
  }
}

export default ModelFactory;
