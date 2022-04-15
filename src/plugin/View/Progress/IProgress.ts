import ISubject from '../../Subject/ISubject';

interface IProgress {
  subject: ISubject;
  isVertical: boolean;
  setPosition(isDouble: boolean, from: number, to: number): void;
}

export default IProgress;
