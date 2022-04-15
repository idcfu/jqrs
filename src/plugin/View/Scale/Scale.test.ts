import Subject from '../../Subject/Subject';
import Scale from './Scale';

jest.mock('../../Subject/Subject');

const jqrs = document.createElement('div');
document.body.append(jqrs);

const scale = new Scale(new Subject(), jqrs);
let element: HTMLElement;

describe('Scale', () => {
  describe('render', () => {
    it('scaleSize <= root', () => {
      jest.spyOn(jqrs, 'clientWidth', 'get').mockReturnValue(100);

      scale.render([
        {
          position: 0,
          value: 0,
        },

        {
          position: 100,
          value: 1,
        },
      ]);

      element = jqrs.querySelector('.jqrs__scale') as HTMLElement;

      expect(element.childElementCount).toBe(2);
    });

    it('else', () => {
      jest.spyOn(jqrs, 'clientWidth', 'get').mockReturnValue(0);

      scale.render([
        {
          position: 0,
          value: 0,
        },

        {
          position: 50,
          value: 1,
        },

        {
          position: 100,
          value: 2,
        },
      ]);

      expect(element.childElementCount).toBe(0);
    });
  });

  it('fit', () => {
    scale.fit = jest.fn(scale.fit.bind(scale));

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('jqrs__tick');
    element.append(svg);

    expect(scale.fit).toThrow(`'${svg}' is not a HTML element`);
  });

  it('pointerdown', () => {
    const tick = document.createElement('div');
    tick.classList.add('jqrs__tick');
    tick.style.left = '0%';

    Object.defineProperty(Event.prototype, 'target', { value: tick });

    element.dispatchEvent(new PointerEvent('pointerdown'));

    expect(scale.subject.notify).toHaveBeenCalledWith('scalePointerdown', 0);

    jest.clearAllMocks();

    scale.isVertical = true;
    tick.style.bottom = '100%';

    element.dispatchEvent(new PointerEvent('pointerdown'));

    expect(scale.subject.notify).toHaveBeenCalledWith('scalePointerdown', 100);

    jest.clearAllMocks();

    Object.defineProperty(Event.prototype, 'target', { value: document.createElement('div') });

    element.dispatchEvent(new PointerEvent('pointerdown'));

    expect(scale.subject.notify).not.toBeCalled();
  });
});
