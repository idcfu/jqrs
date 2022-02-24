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

    const { elements, plugin } = this;

    switch (target) {
      case elements.min:
        plugin.setMin(Number(target.value));
        break;
      case elements.max:
        plugin.setMax(Number(target.value));
        break;
      case elements.step:
        plugin.setStep(Number(target.value));
        break;
      case elements.from:
        plugin.setFrom(Number(target.value));
        break;
      case elements.to:
        plugin.setTo(Number(target.value));
        break;
      case elements.double:
        plugin.setIsDouble(target.checked);
        break;
      case elements.tip:
        plugin.setHasTip(target.checked);
        break;
      case elements.scale:
        plugin.setHasScale(target.checked);
        break;
      case elements.vertical: {
        const exampleJqrs: HTMLElement | null = elements.example.querySelector('.js-example__jqrs');
        if (!exampleJqrs) throw new Error("'exampleJqrs' is 'null'");

        if (target.checked) exampleJqrs.classList.add('example__jqrs_vertical');
        else exampleJqrs.classList.remove('example__jqrs_vertical');

        plugin.setIsVertical(target.checked);
      }
        break;
      default:
    }
  }

  private update(options: Required<IOptions>): void {
    const { elements } = this;

    elements.min.value = String(options.min);
    elements.max.value = String(options.max);
    elements.step.value = String(options.step);

    elements.from.min = String(options.min);
    elements.from.step = String(options.step);
    elements.from.value = String(options.from);

    elements.to.min = String(options.min);
    elements.to.step = String(options.step);
    elements.to.value = String(options.to);
    elements.to.disabled = !options.isDouble;

    elements.double.checked = options.isDouble;
    elements.tip.checked = options.hasTip;
    elements.scale.checked = options.hasScale;
    elements.vertical.checked = options.isVertical;
  }
}

export default Example;
