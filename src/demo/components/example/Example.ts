import { IElements, IOptions } from '../../../types/types';

class Example {
  private elements;
  private plugin;

  public constructor(id: number, options: IOptions) {
    this.elements = Example.findElements(id);
    this.plugin = $(this.elements.jqrs).jqrs(options);

    this.initialize();
  }

  private static findElements(id: number): IElements {
    const example = document.querySelector(`#js-example-${id}`) as HTMLElement;
    if (!(example instanceof HTMLElement)) throw new Error("'example' is not a HTML element");

    const jqrs = example.querySelector('.js-jqrs') as HTMLElement;
    if (!(jqrs instanceof HTMLElement)) throw new Error("'jqrs' is not a HTML element");

    const min = example.querySelector('.js-option__value_type_min') as HTMLInputElement;
    if (!(min instanceof HTMLInputElement)) throw new Error("'min' is not an 'input' element");

    const max = example.querySelector('.js-option__value_type_max') as HTMLInputElement;
    if (!(max instanceof HTMLInputElement)) throw new Error("'max' is not an 'input' element");

    const step = example.querySelector('.js-option__value_type_step') as HTMLInputElement;
    if (!(step instanceof HTMLInputElement)) throw new Error("'step' is not an 'input' element");

    const from = example.querySelector('.js-option__value_type_from') as HTMLInputElement;
    if (!(from instanceof HTMLInputElement)) throw new Error("'from' is not an 'input' element");

    const to = example.querySelector('.js-option__value_type_to') as HTMLInputElement;
    if (!(to instanceof HTMLInputElement)) throw new Error("'to' is not an 'input' element");

    const double = example.querySelector('.js-option__value_type_double') as HTMLInputElement;
    if (!(double instanceof HTMLInputElement)) throw new Error("'double' is not an 'input' element");

    const tip = example.querySelector('.js-option__value_type_tip') as HTMLInputElement;
    if (!(tip instanceof HTMLInputElement)) throw new Error("'tip' is not an 'input' element");

    const scale = example.querySelector('.js-option__value_type_scale') as HTMLInputElement;
    if (!(scale instanceof HTMLInputElement)) throw new Error("'scale' is not an 'input' element");

    const vertical = example.querySelector('.js-option__value_type_vertical') as HTMLInputElement;
    if (!(vertical instanceof HTMLInputElement)) throw new Error("'vertical' is not an 'input' element");

    return { example, jqrs, min, max, step, from, to, double, tip, scale, vertical };
  }

  private initialize(): void {
    this.plugin.setUpdate(this.update.bind(this));
    this.elements.example.addEventListener('change', this.handleExampleChange.bind(this));
  }

  private handleExampleChange({ target }: Event): void {
    if (!(target instanceof HTMLInputElement)) throw new Error(`'${target}' is not an 'input' element`);

    switch (target) {
      case this.elements.min:
        this.plugin.setMin(Number(target.value));
        break;
      case this.elements.max:
        this.plugin.setMax(Number(target.value));
        break;
      case this.elements.step:
        this.plugin.setStep(Number(target.value));
        break;
      case this.elements.from:
        this.plugin.setFrom(Number(target.value));
        break;
      case this.elements.to:
        this.plugin.setTo(Number(target.value));
        break;
      case this.elements.double:
        this.plugin.setIsDouble(target.checked);
        break;
      case this.elements.tip:
        this.plugin.setHasTip(target.checked);
        break;
      case this.elements.scale:
        this.plugin.setHasScale(target.checked);
        break;
      case this.elements.vertical: {
        const exampleJqrs = this.elements.example.querySelector('.js-example__jqrs') as HTMLElement;
        if (!(exampleJqrs instanceof HTMLElement)) throw new Error("'exampleJqrs' is not a HTML element");

        if (target.checked) exampleJqrs.classList.add('example__jqrs_is-vertical');
        else exampleJqrs.classList.remove('example__jqrs_is-vertical');

        this.plugin.setIsVertical(target.checked);
      }
        break;
      default:
    }
  }

  private update(options: Required<IOptions>): void {
    this.elements.min.value = String(options.min);
    this.elements.max.value = String(options.max);
    this.elements.step.value = String(options.step);

    this.elements.from.min = String(options.min);
    this.elements.from.step = String(options.step);
    this.elements.from.value = String(options.from);

    this.elements.to.min = String(options.min);
    this.elements.to.step = String(options.step);
    this.elements.to.value = String(options.to);
    this.elements.to.disabled = !options.isDouble;

    this.elements.double.checked = options.isDouble;
    this.elements.tip.checked = options.hasTip;
    this.elements.scale.checked = options.hasScale;
    this.elements.vertical.checked = options.isVertical;
  }
}

export default Example;
