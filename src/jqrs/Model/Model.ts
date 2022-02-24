import Observable from '../Observable/Observable';
import IActiveTick from '../types/IActiveTick';
import IActiveTicks from '../types/IActiveTicks';
import IOptions from '../types/IOptions';
import ITick from '../types/ITick';
import IModel from './IModel';

class Model implements IModel {
  public optionsUpdate;
  public scaleUpdate;
  public activeTicksUpdate;
  public options;
  public scale;
  public activeTicks;

  public constructor(
    optionsUpdate: Observable,
    scaleUpdate: Observable,
    activeTicksUpdate: Observable,
    options: IOptions,
  ) {
    this.optionsUpdate = optionsUpdate;
    this.scaleUpdate = scaleUpdate;
    this.activeTicksUpdate = activeTicksUpdate;
    this.options = Model.createOptions(options);
    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();
  }

  public initialize(): void {
    this.optionsUpdate.notify();
    this.scaleUpdate.notify();
    this.activeTicksUpdate.notify();
  }

  public setMin(min: number): void {
    const { optionsUpdate, scaleUpdate, activeTicksUpdate, options } = this;
    const { max, step } = options;

    const newMin = Model.validateNumber(min, 'min');
    const range = Model.roundValue(max - newMin);

    if (newMin >= max) {
      options.step = 0.1;
      options.min = Model.roundValue(max - options.step);
    } else if (step > range) {
      options.step = range;
      options.min = newMin;
    } else {
      options.min = newMin;
    }

    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();

    optionsUpdate.notify();
    scaleUpdate.notify();
    activeTicksUpdate.notify();
  }

  public setMax(max: number): void {
    const { optionsUpdate, scaleUpdate, activeTicksUpdate, options } = this;
    const { min, step } = options;

    const newMax = Model.validateNumber(max, 'max');
    const range = Model.roundValue(newMax - min);

    if (newMax <= min) {
      options.step = 0.1;
      options.max = Model.roundValue(min + options.step);
    } else if (step > range) {
      options.step = range;
      options.max = newMax;
    } else {
      options.max = newMax;
    }

    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();

    optionsUpdate.notify();
    scaleUpdate.notify();
    activeTicksUpdate.notify();
  }

  public setStep(step: number): void {
    const { optionsUpdate, scaleUpdate, activeTicksUpdate, options } = this;
    const { min, max } = options;

    const newStep = Model.validateNumber(step, 'step');
    const range = Model.roundValue(max - min);

    if (newStep <= 0) options.step = 0.1;
    else if (newStep > range) options.step = range;
    else options.step = newStep;

    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();

    optionsUpdate.notify();
    scaleUpdate.notify();
    activeTicksUpdate.notify();
  }

  public setFrom(from: number, type: keyof ITick): void {
    const { optionsUpdate, activeTicksUpdate, options, activeTicks } = this;
    const { toTick } = activeTicks;

    const newFrom = Model.validateNumber(from, 'from');

    activeTicks.fromTick = this.createActiveTick(newFrom, 0, toTick.index - 1, type);
    options.from = activeTicks.fromTick.tick.value;

    optionsUpdate.notify();
    activeTicksUpdate.notify();
  }

  public setTo(to: number, type: keyof ITick): void {
    const { optionsUpdate, activeTicksUpdate, options, scale, activeTicks } = this;
    const { fromTick } = activeTicks;

    const newTo = Model.validateNumber(to, 'to');

    activeTicks.toTick = this.createActiveTick(newTo, fromTick.index + 1, scale.length - 1, type);
    options.to = activeTicks.toTick.tick.value;

    optionsUpdate.notify();
    activeTicksUpdate.notify();
  }

  public setIsDouble(isDouble: boolean): void {
    Model.validateBoolean(isDouble, 'isDouble');
    this.options.isDouble = isDouble;

    this.optionsUpdate.notify();
  }

  public setHasTip(hasTip: boolean): void {
    Model.validateBoolean(hasTip, 'hasTip');
    this.options.hasTip = hasTip;

    this.optionsUpdate.notify();
  }

  public setHasScale(hasScale: boolean): void {
    Model.validateBoolean(hasScale, 'hasScale');
    this.options.hasScale = hasScale;

    this.optionsUpdate.notify();
    this.scaleUpdate.notify();
  }

  public setIsVertical(isVertical: boolean): void {
    Model.validateBoolean(isVertical, 'isVertical');
    this.options.isVertical = isVertical;

    this.optionsUpdate.notify();
    this.scaleUpdate.notify();
    this.activeTicksUpdate.notify();
  }

  public setActiveTick(position: number): void {
    const { optionsUpdate, activeTicksUpdate, options, scale, activeTicks } = this;
    const { fromTick, toTick } = activeTicks;

    const closest = this.findClosestTick(position, 'position');
    const tick = this.createActiveTickHelper(scale.indexOf(closest));

    const differenceWithFrom = Math.abs(position - fromTick.tick.position);
    const differenceWithTo = Math.abs(position - toTick.tick.position);

    const closestToTick = differenceWithFrom < differenceWithTo ? 'from' : 'to';

    activeTicks[`${closestToTick}Tick`] = tick;
    options[closestToTick] = tick.tick.value;

    optionsUpdate.notify();
    activeTicksUpdate.notify();
  }

  public setActiveTickFromExactPosition(position: number): void {
    const { optionsUpdate, activeTicksUpdate, options, scale, activeTicks } = this;
    const { fromTick, toTick } = activeTicks;

    const tickIndex = scale.findIndex(({ position: currentPosition }) => (
      currentPosition === position
    ));

    const tick = this.createActiveTickHelper(tickIndex);
    const isExactBetween = tickIndex - 1 === fromTick.index && tickIndex + 1 === toTick.index;

    if (isExactBetween) {
      activeTicks.toTick = tick;
      options.to = tick.tick.value;
    } else {
      const differenceWithFrom = Math.abs(tickIndex - fromTick.index);
      const differenceWithTo = Math.abs(tickIndex - toTick.index);

      const closestToTick = differenceWithFrom < differenceWithTo ? 'from' : 'to';

      activeTicks[`${closestToTick}Tick`] = tick;
      options[closestToTick] = tick.tick.value;
    }

    optionsUpdate.notify();
    activeTicksUpdate.notify();
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
      min = Model.roundValue(max - step);
    }

    const range = Model.roundValue(max - min);
    if (step > range) step = range;

    if (from <= min) from = min;
    else if (from >= to) from = Model.roundValue(to - step);

    if (to <= from) to = Model.roundValue(from + step);
    else if (to >= max) to = max;

    return { min, max, step, from, to, isDouble, hasTip, hasScale, isVertical };
  }

  private static validateBoolean(value: boolean, type: 'isDouble' | 'hasTip' | 'hasScale' | 'isVertical'): void {
    if (typeof value !== 'boolean') throw new Error(`Must be: 'typeof ${type} === boolean'`);
  }

  private static validateNumber(value: number, type: 'min' | 'max' | 'step' | 'from' | 'to'): number {
    if (typeof value !== 'number') throw new Error(`Must be: 'typeof ${type} === number'`);

    return this.roundValue(value);
  }

  private static roundValue(value: number): number {
    if (value === 0) return 0;
    return Math.abs(value) < 0.0001 ? 0.0001 : Math.round(value * 10000) / 10000;
  }

  private static roundPosition(value: number): number {
    return Math.round(value * 10000) / 10000;
  }

  private createScale(): ITick[] {
    const { options } = this;
    const { min, max } = options;
    let { step } = options;

    let intervals = Model.roundValue(max - min) / step;

    if (intervals > 1000) {
      intervals = 1000;
      step = Model.roundValue((max - min) / 1000);
      options.step = step;
    }

    const intervalPercentage = Model.roundPosition(100 / intervals);

    const scale: ITick[] = [];
    let position = 0;
    let value = min;

    for (let index = 0; index < intervals; index += 1) {
      scale.push({ position, value });
      position = Model.roundPosition(position + intervalPercentage);
      value = Model.roundValue(value + step);
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
    const differenceWithFirst = Math.abs(value - firstTick[type]);

    const lastTick = scale[first];
    const differenceWithLast = Math.abs(value - lastTick[type]);

    const closest = differenceWithFirst < differenceWithLast ? firstTick : lastTick;

    return closest;
  }
}

export default Model;
