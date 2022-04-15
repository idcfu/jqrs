import ISubject from '../../Subject/ISubject';

interface IThumb {
  subject: ISubject;
  element: HTMLElement;
  isVertical: boolean;
  render(): void;
  remove(): void;
  setPosition(position: number): void;
}

export default IThumb;
