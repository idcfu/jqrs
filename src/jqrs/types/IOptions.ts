interface IOptions {
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly from?: number;
  readonly to?: number;
  readonly isDouble?: boolean;
  readonly hasTip?: boolean;
  readonly hasScale?: boolean;
  readonly isVertical?: boolean;
}

export default IOptions;
