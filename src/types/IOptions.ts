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

export default IOptions;
