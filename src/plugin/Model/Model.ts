import { IActiveTick, IActiveTicks, IOptions, ITick } from '../../types/types';
import ISubject from '../Subject/ISubject';
import IModel from './IModel';

class Model implements IModel {
  public subject;
  public options;
  public scale;
  public activeTicks;

  public constructor(subject: ISubject, options: IOptions) {
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
      this.options.min = this.scale[this.scale.length - 2].value;
    } else if (this.options.step > range) {
      this.options.min = newMin;
      this.options.step = range;
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
      this.options.max = this.scale[1].value;
    } else if (this.options.step > range) {
      this.options.max = newMax;
      this.options.step = range;
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

    if (newStep <= 0) {
      this.subject.notify('optionsUpdate');
      return;
    }

    if (newStep > range) this.options.step = range;
    else this.options.step = newStep;

    this.scale = this.createScale();
    this.activeTicks = this.createActiveTicks();

    this.subject.notify('optionsUpdate');
    this.subject.notify('scaleUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setFrom(from: number, tickKey: keyof ITick): void {
    const newFrom = Model.validateNumber(from, 'from');
    const last = this.activeTicks.to.index - 1;

    this.activeTicks.from = this.createActiveTick('from', tickKey, newFrom, 0, last);
    this.options.from = this.activeTicks.from.tick.value;

    this.subject.notify('optionsUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setTo(to: number, tickKey: keyof ITick): void {
    const newTo = Model.validateNumber(to, 'to');
    const first = this.options.isDouble ? this.activeTicks.from.index + 1 : 1;

    this.activeTicks.to = this.createActiveTick('to', tickKey, newTo, first);
    this.options.to = this.activeTicks.to.tick.value;

    this.subject.notify('optionsUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setIsDouble(isDouble: boolean): void {
    Model.validateBoolean(isDouble, 'isDouble');
    this.options.isDouble = isDouble;

    const isShiftNeeded = isDouble && this.options.from >= this.options.to;

    if (isShiftNeeded) {
      this.activeTicks.from = this.createActiveTickHelper(this.activeTicks.to.index - 1);
      this.options.from = this.activeTicks.from.tick.value;
    }

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
    if (position <= 0) {
      this.activeTicks.from = this.createActiveTickHelper(0);
      this.options.from = this.activeTicks.from.tick.value;
    } else if (position >= 100) {
      if (this.options.isDouble) {
        this.activeTicks.to = this.createActiveTickHelper(this.scale.length - 1);
        this.options.to = this.activeTicks.to.tick.value;
      } else {
        this.activeTicks.from = this.createActiveTickHelper(this.scale.length - 1);
        this.options.from = this.activeTicks.from.tick.value;
      }
    } else {
      const closest = this.findClosestTick(position, 'position');
      const tick = this.createActiveTickHelper(this.scale.indexOf(closest));

      if (this.options.isDouble) {
        const from = this.activeTicks.from.tick.position;
        const to = this.activeTicks.to.tick.position;
        this.setActiveTickHelper(position, from, to, tick);
      } else {
        this.activeTicks.from = tick;
        this.options.from = tick.tick.value;
      }
    }

    this.subject.notify('optionsUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  public setActiveTickFromExactPosition(position: number): void {
    const index = this.scale.findIndex(({ position: currentPosition }) => (
      currentPosition === position
    ));

    const tick = this.createActiveTickHelper(index);

    if (this.options.isDouble) {
      const isPreviousFrom = index - 1 === this.activeTicks.from.index;
      const isNextTo = index + 1 === this.activeTicks.to.index;
      const isExactBetween = isPreviousFrom && isNextTo;

      if (isExactBetween) {
        this.activeTicks.to = tick;
        this.options.to = tick.tick.value;
      } else {
        const from = this.activeTicks.from.tick.position;
        const to = this.activeTicks.to.tick.position;
        this.setActiveTickHelper(position, from, to, tick);
      }
    } else {
      this.activeTicks.from = tick;
      this.options.from = tick.tick.value;
    }

    this.subject.notify('optionsUpdate');
    this.subject.notify('activeTicksUpdate');
  }

  private static createOptions(options: IOptions): Required<IOptions> {
    const isOptionsValid = typeof options === 'object'
      && Object.hasOwn(options, 'min')
      && Object.hasOwn(options, 'max')
      && Object.hasOwn(options, 'step');

    if (!isOptionsValid) throw new Error("Options object with 'min', 'max' and 'step' properties is required");

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
      min = this.roundValue(max - step);
    }

    const range = this.roundValue(max - min);
    if (step > range) step = range;

    return { min, max, step, from, to, isDouble, hasTip, hasScale, isVertical };
  }

  private static validateBoolean(
    value: boolean,
    type: 'isDouble' | 'hasTip' | 'hasScale' | 'isVertical',
  ): void {
    if (typeof value !== 'boolean') throw new Error(`'${type}' is not a 'boolean' type`);
  }

  private static validateNumber(
    value: number,
    type: 'min' | 'max' | 'step' | 'from' | 'to',
  ): number {
    if (!Number.isFinite(value)) throw new Error(`'${type}' is not a finite number`);

    return this.roundValue(value);
  }

  private static roundValue(value: number): number {
    if (value === 0) return 0;
    return Math.abs(value) < 0.0001 ? 0.0001 : Math.round(value * 10000) / 10000;
  }

  private static roundPosition(position: number): number {
    return Math.round(position * 10000) / 10000;
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
    const to = this.createActiveTick('to', 'value', this.options.to, 1);
    this.options.to = to.tick.value;

    const from = this.createActiveTick('from', 'value', this.options.from, 0, to.index - 1);
    this.options.from = from.tick.value;

    return { from, to };
  }

  private createActiveTick(
    type: 'from' | 'to',
    tickKey: keyof ITick,
    value: number,
    first: number,
    last?: number,
  ): IActiveTick {
    const isFromLimitedByTo = type === 'from'
      && this.options.isDouble
      && typeof last === 'number';

    let newLast;

    if (isFromLimitedByTo) newLast = last;
    else newLast = this.scale.length - 1;

    let tick;

    if (value <= this.scale[first][tickKey]) {
      tick = this.createActiveTickHelper(first);
    } else if (value >= this.scale[newLast][tickKey]) {
      tick = this.createActiveTickHelper(newLast);
    } else {
      const closest = this.findClosestTick(value, tickKey);
      tick = this.createActiveTickHelper(this.scale.indexOf(closest));
    }

    return tick;
  }

  private createActiveTickHelper(index: number): IActiveTick {
    return {
      index,
      tick: this.scale[index],
    };
  }

  private setActiveTickHelper(value: number, from: number, to: number, tick: IActiveTick): void {
    const differenceWithFrom = Math.abs(value - from);
    const differenceWithTo = Math.abs(value - to);
    const closestToTick = differenceWithFrom < differenceWithTo ? 'from' : 'to';

    this.activeTicks[closestToTick] = tick;
    this.options[closestToTick] = tick.tick.value;
  }

  private findClosestTick(value: number, tickKey: keyof ITick): ITick {
    let first = 0;
    let last = this.scale.length - 1;

    while (first <= last) {
      const middle = Math.ceil((first + last) / 2);
      const middleTick = this.scale[middle];

      if (value === middleTick[tickKey]) return middleTick;

      if (value < middleTick[tickKey]) last = middle - 1;
      else first = middle + 1;
    }

    const firstTick = this.scale[last];
    const differenceWithFirst = Math.abs(value - firstTick[tickKey]);

    const lastTick = this.scale[first];
    const differenceWithLast = Math.abs(value - lastTick[tickKey]);

    const closest = differenceWithFirst < differenceWithLast ? firstTick : lastTick;

    return closest;
  }
}

export default Model;
