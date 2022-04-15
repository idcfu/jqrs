interface IActiveTick {
  tick: ITick;
  index: number;
}

interface IActiveTicks {
  from: IActiveTick;
  to: IActiveTick;
}

interface IElements {
  example: HTMLElement;
  jqrs: HTMLElement;
  min: HTMLInputElement;
  max: HTMLInputElement;
  step: HTMLInputElement;
  from: HTMLInputElement;
  to: HTMLInputElement;
  double: HTMLInputElement;
  tip: HTMLInputElement;
  scale: HTMLInputElement;
  vertical: HTMLInputElement;
}

type IEventName =
  'activeTicksUpdate'
  | 'fromThumbPointermove'
  | 'hasTipUpdate'
  | 'isDoubleUpdate'
  | 'isVerticalUpdate'
  | 'optionsUpdate'
  | 'progressPointerdown'
  | 'scalePointerdown'
  | 'scaleUpdate'
  | 'toThumbPointermove'
  | 'trackPointerdown'
  | 'viewFromThumbPointermove'
  | 'viewProgressPointerdown'
  | 'viewScalePointerdown'
  | 'viewToThumbPointermove'
  | 'viewTrackPointerdown';

interface IOptions {
  min: number;
  max: number;
  step: number;
  from?: number;
  to?: number;
  isDouble?: boolean;
  hasTip?: boolean;
  hasScale?: boolean;
  isVertical?: boolean;
}

interface ITick {
  position: number;
  value: number;
}

type IUpdate = (options: Required<IOptions>) => void;

export { IActiveTick, IActiveTicks, IElements, IEventName, IOptions, ITick, IUpdate };
