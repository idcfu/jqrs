import Observable from '../Observable/Observable';
import IOptions from '../types/IOptions';
import ITick from '../types/ITick';
import { IActiveTick, IActiveTicks, IModel } from './types';

class Model implements IModel {
  public update;
  public options;
  public scale;
  public activeTicks;

  public constructor(update: Observable, options: IOptions) {
    this.update = update;
    this.options = Model.createOptions(options);
    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();
  }

  public initialize(): void {
    this.update.notify();
  }

  public setMin(min: number): void {
    const { options } = this;
    const { max, step } = options;

    const newMin = Model.validateNumber(min, 'min');
    const range = Model.roundToDecimal(max - newMin);

    if (newMin >= max) {
      options.step = 0.1;
      options.min = Model.roundToDecimal(max - options.step);
    } else if (step > range) {
      options.step = range;
      options.min = newMin;
    } else {
      options.min = newMin;
    }

    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();

    this.update.notify();
  }

  public setMax(max: number): void {
    const { options } = this;
    const { min, step } = options;

    const newMax = Model.validateNumber(max, 'max');
    const range = Model.roundToDecimal(newMax - min);

    if (newMax <= min) {
      options.step = 0.1;
      options.max = Model.roundToDecimal(min + options.step);
    } else if (step > range) {
      options.step = range;
      options.max = newMax;
    } else {
      options.max = newMax;
    }

    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();

    this.update.notify();
  }

  public setStep(step: number): void {
    const { options } = this;
    const { min, max } = options;

    const newStep = Model.validateNumber(step, 'step');

    if (newStep <= 0) options.step = 0.1;
    else if (newStep > max - min) options.step = Model.roundToDecimal(max - min);
    else options.step = newStep;

    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();

    this.update.notify();
  }

  public setFrom(from: number, type: keyof ITick): void {
    const { activeTicks } = this;

    const newFrom = Model.validateNumber(from, 'from');
    const highestIndex = activeTicks.toTick.index - 1;

    activeTicks.fromTick = this.createActiveTick(newFrom, 0, highestIndex, type);
    this.options.from = activeTicks.fromTick.tick.value;

    this.update.notify();
  }

  public setTo(to: number, type: keyof ITick): void {
    const { activeTicks } = this;

    const newTo = Model.validateNumber(to, 'to');
    const lowestIndex = activeTicks.fromTick.index + 1;
    const highestIndex = this.scale.length - 1;

    activeTicks.toTick = this.createActiveTick(newTo, lowestIndex, highestIndex, type);
    this.options.to = activeTicks.toTick.tick.value;

    this.update.notify();
  }

  public setIsDouble(isDouble: boolean): void {
    Model.validateBoolean(isDouble, 'isDouble');
    this.options.isDouble = isDouble;

    this.update.notify();
  }

  public setHasTip(hasTip: boolean): void {
    Model.validateBoolean(hasTip, 'hasTip');
    this.options.hasTip = hasTip;

    this.update.notify();
  }

  public setHasScale(hasScale: boolean): void {
    Model.validateBoolean(hasScale, 'hasScale');
    this.options.hasScale = hasScale;

    this.update.notify();
  }

  public setIsVertical(isVertical: boolean): void {
    Model.validateBoolean(isVertical, 'isVertical');
    this.options.isVertical = isVertical;

    this.update.notify();
  }

  private static createOptions(options: IOptions): Required<IOptions> {
    const isOptionsValid = options
      && typeof options === 'object'
      && typeof options.min !== undefined
      && typeof options.max !== undefined
      && typeof options.step !== undefined;

    if (!isOptionsValid) throw new Error("Options object with 'min', 'max', and 'step' properties is required");

    const {
      isDouble = false,
      hasTip = false,
      hasScale = false,
      isVertical = false,
    } = options;

    this.validateBoolean(isDouble, 'isDouble');
    this.validateBoolean(hasTip, 'hasTip');
    this.validateBoolean(hasScale, 'hasScale');
    this.validateBoolean(isVertical, 'isVertical');

    let {
      min,
      max,
      step,
      from = min,
      to = max,
    } = options;

    min = this.validateNumber(min, 'min');
    max = this.validateNumber(max, 'max');
    step = this.validateNumber(step, 'step');
    from = this.validateNumber(from, 'from');
    to = this.validateNumber(to, 'to');

    if (min >= max) {
      step = 0.1;
      min = Model.roundToDecimal(max - step);
    }

    const range = Model.roundToDecimal(max - min);
    if (step > range) step = range;

    if (from <= min) from = min;
    else if (from >= to) from = Model.roundToDecimal(to - step);

    if (to <= from) to = Model.roundToDecimal(from + step);
    else if (to >= max) to = max;

    return { min, max, step, from, to, isDouble, hasTip, hasScale, isVertical };
  }

  private static validateBoolean(value: boolean, type: 'isDouble' | 'hasTip' | 'hasScale' | 'isVertical'): void {
    if (typeof value !== 'boolean') throw new Error(`Must be: 'typeof ${type} === boolean'`);
  }

  private static validateNumber(value: number, type: 'min' | 'max' | 'step' | 'from' | 'to'): number {
    if (typeof value !== 'number') throw new Error(`Must be: 'typeof ${type} === number'`);

    return this.roundToDecimal(value);
  }

  private static roundToDecimal(value: number): number {
    if (value === 0) return 0;
    return Math.abs(value) < 0.1 ? 0.1 : Math.round(value * 10) / 10;
  }

  private createScale(): ITick[] {
    const { min, max, step } = this.options;

    let intervals = Model.roundToDecimal(max - min) / step;
    if (intervals > 100) intervals = 100;

    const intervalPercentage = Model.roundToDecimal(100 / intervals);

    const scale: ITick[] = [];
    let position = 0;
    let value = min;

    for (let index = 0; index < intervals; index += 1) {
      scale.push({ position, value });
      position = Model.roundToDecimal(position + intervalPercentage);
      value = Model.roundToDecimal(value + step);
    }

    scale.push({ position: 100, value: max });

    return scale;
  }

  private createActiveTicks(): IActiveTicks {
    const { options, scale } = this;
    const { from, to } = options;

    const toTick = this.createActiveTick(to, 1, scale.length - 1, 'value');
    let fromTick = this.createActiveTick(from, 0, scale.length - 2, 'value');

    if (toTick === fromTick) fromTick = this.createActiveTickHelper(toTick.index - 1);

    options.from = fromTick.tick.value;
    options.to = toTick.tick.value;

    return { fromTick, toTick };
  }

  private createActiveTick(
    value: number,
    lowestIndex: number,
    highestIndex: number,
    type: keyof ITick,
  ): IActiveTick {
    const { scale } = this;

    let tick;

    if (value <= scale[lowestIndex][type]) {
      tick = this.createActiveTickHelper(lowestIndex);
    } else if (value >= scale[highestIndex][type]) {
      tick = this.createActiveTickHelper(highestIndex);
    } else {
      const closest = this.findClosestTick(value, type);
      tick = this.createActiveTickHelper(scale.indexOf(closest));
    }

    return tick;
  }

  private createActiveTickHelper(index: number): IActiveTick {
    return {
      tick: this.scale[index],
      index,
    };
  }

  private findClosestTick(value: number, type: keyof ITick): ITick {
    const { scale } = this;

    let first = 0;
    let last = scale.length - 1;

    while (first <= last) {
      const middle = Math.ceil((first + last) / 2);
      const middleTick = scale[middle];

      if (value === middleTick[type]) return middleTick;

      if (value < middleTick[type]) last = middle - 1;
      else first = middle + 1;
    }

    const firstTick = scale[last];
    const differenceWithFirstTick = Math.abs(value - firstTick[type]);

    const lastTick = scale[first];
    const differenceWithLastTick = Math.abs(value - lastTick[type]);

    const closest = differenceWithFirstTick < differenceWithLastTick ? firstTick : lastTick;

    return closest;
  }
}

export default Model;
