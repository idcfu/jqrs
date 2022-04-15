import { IEventName } from '../../types/types';

interface ISubject {
  attach(type: IEventName, observer: Function): void;
  detach(type: IEventName, observer: Function): void;
  notify(type: IEventName, data?: number): void;
}

export default ISubject;
