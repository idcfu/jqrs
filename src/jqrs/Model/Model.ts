import Subject from '../Subject/Subject';
import IActiveTick from '../types/IActiveTick';
import IActiveTicks from '../types/IActiveTicks';
import IOptions from '../types/IOptions';
import ITick from '../types/ITick';
import IModel from './IModel';

class Model implements IModel {
  public subject;
  public options;
  public scale;
  public activeTicks;

  public constructor(subject: Subject, options: IOptions) {
    this.subject = subject;
    this.options = Model.createOptions(options);
    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();
  }

  public initialize(): void {
    this.subject.notify('optionsUpdate');
    this.subject.notify('isDoubleUpdate');
    this.subject.notify('hasTipUpdate');
    this.subject.notify('isVerticalUpdate');
    this.subject.notify('scaleUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setMin(min: number): void {
    const newMin = Model.validateNumber(min, 'min');
    const range = Model.roundValue(this.options.max - newMin);

    if (newMin >= this.options.max) {
      this.options.step = 0.0001;
      this.options.min = Model.roundValue(this.options.max - this.options.step);
    } else if (this.options.step > range) {
      this.options.step = range;
      this.options.min = newMin;
    } else {
      this.options.min = newMin;
    }

    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();

    this.subject.notify('optionsUpdate');
    this.subject.notify('scaleUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setMax(max: number): void {
    const newMax = Model.validateNumber(max, 'max');
    const range = Model.roundValue(newMax - this.options.min);

    if (newMax <= this.options.min) {
      this.options.step = 0.0001;
      this.options.max = Model.roundValue(this.options.min + this.options.step);
    } else if (this.options.step > range) {
      this.options.step = range;
      this.options.max = newMax;
    } else {
      this.options.max = newMax;
    }

    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();

    this.subject.notify('optionsUpdate');
    this.subject.notify('scaleUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setStep(step: number): void {
    const newStep = Model.validateNumber(step, 'step');
    const range = Model.roundValue(this.options.max - this.options.min);

    if (newStep <= 0) this.options.step = 0.0001;
    else if (newStep > range) this.options.step = range;
    else this.options.step = newStep;

    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();

    this.subject.notify('optionsUpdate');
    this.subject.notify('scaleUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setFrom(from: number, type: keyof ITick): void {
    const newFrom = Model.validateNumber(from, 'from');
    const highestIndex = this.activeTicks.toTick.index - 1;

    this.activeTicks.fromTick = this.createActiveTick(newFrom, 0, highestIndex, type);
    this.options.from = this.activeTicks.fromTick.tick.value;

    this.subject.notify('optionsUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setTo(to: number, type: keyof ITick): void {
    const newTo = Model.validateNumber(to, 'to');
    const lowestIndex = this.activeTicks.fromTick.index + 1;
    const highestIndex = this.scale.length - 1;

    this.activeTicks.toTick = this.createActiveTick(newTo, lowestIndex, highestIndex, type);
    this.options.to = this.activeTicks.toTick.tick.value;

    this.subject.notify('optionsUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setIsDouble(isDouble: boolean): void {
    Model.validateBoolean(isDouble, 'isDouble');
    this.options.isDouble = isDouble;

    this.subject.notify('optionsUpdate');
    this.subject.notify('isDoubleUpdate');
  }

  public setHasTip(hasTip: boolean): void {
    Model.validateBoolean(hasTip, 'hasTip');
    this.options.hasTip = hasTip;

    this.subject.notify('optionsUpdate');
    this.subject.notify('hasTipUpdate');
  }

  public setHasScale(hasScale: boolean): void {
    Model.validateBoolean(hasScale, 'hasScale');
    this.options.hasScale = hasScale;

    this.subject.notify('optionsUpdate');
    this.subject.notify('scaleUpdate');
  }

  public setIsVertical(isVertical: boolean): void {
    Model.validateBoolean(isVertical, 'isVertical');
    this.options.isVertical = isVertical;

    this.subject.notify('optionsUpdate');
    this.subject.notify('isVerticalUpdate');
  }

  public setActiveTick(position: number): void {
    const closest = this.findClosestTick(position, 'position');
    const tick = this.createActiveTickHelper(this.scale.indexOf(closest));

    const fromPosition = this.activeTicks.fromTick.tick.position;
    const toPosition = this.activeTicks.toTick.tick.position;
    this.setActiveTickHelper(position, fromPosition, toPosition, tick);

    this.subject.notify('optionsUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setActiveTickFromExactPosition(position: number): void {
    const tickIndex = this.scale.findIndex(({ position: currentPosition }) => (
      currentPosition === position
    ));

    const tick = this.createActiveTickHelper(tickIndex);

    const isPreviousFrom = tickIndex - 1 === this.activeTicks.fromTick.index;
    const isNextTo = tickIndex + 1 === this.activeTicks.toTick.index;
    const isExactBetween = isPreviousFrom && isNextTo;

    if (isExactBetween) {
      this.activeTicks.toTick = tick;
      this.options.to = tick.tick.value;
    } else {
      const fromIndex = this.activeTicks.fromTick.index;
      const toIndex = this.activeTicks.toTick.index;
      this.setActiveTickHelper(tickIndex, fromIndex, toIndex, tick);
    }

    this.subject.notify('optionsUpdate');
    this.subject.notify('activeTicksUpdate');
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
      step = 0.0001;
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
    let intervals = Model.roundValue(this.options.max - this.options.min) / this.options.step;

    if (intervals > 1000) {
      intervals = 1000;
      this.options.step = Model.roundValue((this.options.max - this.options.min) / 1000);
    }

    const intervalPercentage = Model.roundPosition(100 / intervals);

    const scale: ITick[] = [];
    let position = 0;
    let value = this.options.min;

    for (let index = 0; index < intervals; index += 1) {
      scale.push({ position, value });
      position = Model.roundPosition(position + intervalPercentage);
      value = Model.roundValue(value + this.options.step);
    }

    scale.push({ position: 100, value: this.options.max });

    return scale;
  }

  private createActiveTicks(): IActiveTicks {
    const toTick = this.createActiveTick(this.options.to, 1, this.scale.length - 1, 'value');
    let fromTick = this.createActiveTick(this.options.from, 0, this.scale.length - 2, 'value');

    if (toTick === fromTick) fromTick = this.createActiveTickHelper(toTick.index - 1);

    this.options.from = fromTick.tick.value;
    this.options.to = toTick.tick.value;

    return { fromTick, toTick };
  }

  private createActiveTick(
    value: number,
    lowestIndex: number,
    highestIndex: number,
    type: keyof ITick,
  ): IActiveTick {
    let tick;

    if (value <= this.scale[lowestIndex][type]) {
      tick = this.createActiveTickHelper(lowestIndex);
    } else if (value >= this.scale[highestIndex][type]) {
      tick = this.createActiveTickHelper(highestIndex);
    } else {
      const closest = this.findClosestTick(value, type);
      tick = this.createActiveTickHelper(this.scale.indexOf(closest));
    }

    return tick;
  }

  private createActiveTickHelper(index: number): IActiveTick {
    return {
      tick: this.scale[index],
      index,
    };
  }

  private setActiveTickHelper(value: number, from: number, to: number, tick: IActiveTick): void {
    const differenceWithFrom = Math.abs(value - from);
    const differenceWithTo = Math.abs(value - to);
    const closestToTick = differenceWithFrom < differenceWithTo ? 'from' : 'to';

    this.activeTicks[`${closestToTick}Tick`] = tick;
    this.options[closestToTick] = tick.tick.value;
  }

  private findClosestTick(value: number, type: keyof ITick): ITick {
    let first = 0;
    let last = this.scale.length - 1;

    while (first <= last) {
      const middle = Math.ceil((first + last) / 2);
      const middleTick = this.scale[middle];

      if (value === middleTick[type]) return middleTick;

      if (value < middleTick[type]) last = middle - 1;
      else first = middle + 1;
    }

    const firstTick = this.scale[last];
    const differenceWithFirst = Math.abs(value - firstTick[type]);

    const lastTick = this.scale[first];
    const differenceWithLast = Math.abs(value - lastTick[type]);

    const closest = differenceWithFirst < differenceWithLast ? firstTick : lastTick;

    return closest;
  }
}

export default Model;
