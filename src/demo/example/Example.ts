import IOptions from '../../jqrs/types/IOptions';

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

class Example {
  private elements;
  private plugin;

  public constructor(id: number, options: IOptions) {
    this.elements = Example.findElements(id);
    this.plugin = $(this.elements.jqrs).jqrs(options, this.update.bind(this));
  }

  public initialize(): void {
    this.elements.example.addEventListener('change', this.handleExampleChange.bind(this));
  }

  private static findElements(id: number): IElements {
    const example: HTMLElement | null = document.querySelector(`#js-example-${id}`);
    if (!example) throw new Error("'example' is 'null'");

    const jqrs: HTMLElement | null = example.querySelector('.js-jqrs');
    if (!jqrs) throw new Error("'jqrs' is 'null'");

    const min: HTMLInputElement | null = example.querySelector('.js-example__option-value_type_min');
    if (!min) throw new Error("'min' is 'null'");

    const max: HTMLInputElement | null = example.querySelector('.js-example__option-value_type_max');
    if (!max) throw new Error("'max' is 'null'");

    const step: HTMLInputElement | null = example.querySelector('.js-example__option-value_type_step');
    if (!step) throw new Error("'step' is 'null'");

    const from: HTMLInputElement | null = example.querySelector('.js-example__option-value_type_from');
    if (!from) throw new Error("'from' is 'null'");

    const to: HTMLInputElement | null = example.querySelector('.js-example__option-value_type_to');
    if (!to) throw new Error("'to' is 'null'");

    const double: HTMLInputElement | null = example.querySelector('.js-example__option-value_type_double');
    if (!double) throw new Error("'double' is 'null'");

    const tip: HTMLInputElement | null = example.querySelector('.js-example__option-value_type_tip');
    if (!tip) throw new Error("'tip' is 'null'");

    const scale: HTMLInputElement | null = example.querySelector('.js-example__option-value_type_scale');
    if (!scale) throw new Error("'scale' is 'null'");

    const vertical: HTMLInputElement | null = example.querySelector('.js-example__option-value_type_vertical');
    if (!vertical) throw new Error("'vertical' is 'null'");

    return { example, jqrs, min, max, step, from, to, double, tip, scale, vertical };
  }

  private handleExampleChange({ target }: Event): void {
    if (!(target instanceof HTMLInputElement)) throw new Error("'target' must be an instance of 'HTMLInputElement'");

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
        const exampleJqrs: HTMLElement | null = this.elements.example.querySelector('.js-example__jqrs');
        if (!exampleJqrs) throw new Error("'exampleJqrs' is 'null'");

        if (target.checked) exampleJqrs.classList.add('example__jqrs_vertical');
        else exampleJqrs.classList.remove('example__jqrs_vertical');

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
