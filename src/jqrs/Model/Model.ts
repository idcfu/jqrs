import Observable from '../Observable/Observable';
import IOptions from '../types/IOptions';
import ITick from '../types/ITick';

interface ICalculateTicksParameters {
  readonly newMin?: number;
  readonly newMax?: number;
  readonly newStep?: number;
}

class Model {
  public readonly observable;

  private min;
  private max;
  private step;
  private from;
  private to;
  private isDouble;
  private hasTip;
  private hasScale;
  private isVertical;
  private readonly ticks: ITick[] = [];

  public constructor(observable: Observable, {
    min = 0,
    max = 100,
    step = 1,
    from = 30,
    to = 70,
    isDouble = false,
    hasTip = true,
    hasScale = false,
    isVertical = false,
  }: IOptions) {
    this.observable = observable;
    this.min = min;
    this.max = max;
    this.step = step;
    this.from = from;
    this.to = to;
    this.isDouble = isDouble;
    this.hasTip = hasTip;
    this.hasScale = hasScale;
    this.isVertical = isVertical;
  }

  public calculateTicks({ newMin, newMax, newStep }: ICalculateTicksParameters = {}): void {
    this.min = newMin ?? this.min;
    this.max = newMax ?? this.max;
    this.step = newStep ?? this.step;

    const { observable, min, max, step, ticks, hasScale } = this;

    let intervals = (max - min) / step;
    if (intervals > 50) intervals = 50;

    const intervalPercentage = 100 / intervals;

    let position = 0;
    let value = min;

    for (let index = 0; index < intervals; index += 1) {
      ticks.push({ position, value });
      position += intervalPercentage;
      value += step;
    }

    ticks.push({ position: 100, value: max });

    if (hasScale) observable.notify('calculateTicks', ticks);
  }

  public setTip(newHasTip?: boolean): void {
    this.hasTip = newHasTip ?? this.hasTip;

    const { hasTip } = this;

    this.observable.notify('setTip', hasTip);
  }

  public findClosestTick(position?: number): void {
    const { observable, from, ticks } = this;

    if (!position) {
      const tick = ticks.find(({ value }) => value === from);

      observable.notify('findClosestTick', tick);
      return;
    }

    let first = 0;
    let last = ticks.length - 1;

    while (first <= last) {
      const middle = Math.ceil((first + last) / 2);
      const middleTick = ticks[middle];

      if (position === middleTick.position) {
        observable.notify('findClosestTick', middleTick);
        return;
      }

      if (position < middleTick.position) last = middle - 1;
      else first = middle + 1;
    }

    const firstTick = ticks[last];
    const firstDifference = Math.abs(position - firstTick.position);

    const lastTick = ticks[first];
    const lastDifference = Math.abs(position - lastTick.position);

    const closest = firstDifference < lastDifference ? firstTick : lastTick;

    observable.notify('findClosestTick', closest);
  }
}

export default Model;
