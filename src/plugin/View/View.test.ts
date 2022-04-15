import Subject from '../Subject/Subject';
import IView from './IView';
import ViewFactory from './ViewFactory';

jest.mock('../Subject/Subject');

const from = { position: 0, value: 0 };
const to = { position: 100, value: 1 };
const scale = [from, to];
let jqrs: HTMLElement;
let view: IView;

beforeEach(() => {
  jqrs = document.createElement('div');

  jest.spyOn(jqrs, 'clientWidth', 'get').mockReturnValue(100);
  jest.spyOn(jqrs, 'clientHeight', 'get').mockReturnValue(100);

  document.body.innerHTML = '';
  document.body.append(jqrs);

  view = ViewFactory.initialize(new Subject(), jqrs);
});

describe('View', () => {
  it('updateDouble', () => {
    view.updateDouble(true, from, to);

    expect(jqrs.querySelectorAll('.jqrs__thumb').length).toBe(2);

    view.updateDouble(false, from, to);

    expect(jqrs.querySelectorAll('.jqrs__thumb').length).toBe(1);
  });

  it('updateTip', () => {
    view.updateTip(true);

    expect(jqrs.querySelectorAll('.jqrs__tip').length).toBe(1);

    view.updateDouble(true, from, to);

    expect(jqrs.querySelectorAll('.jqrs__tip').length).toBe(2);

    view.updateTip(false);

    expect(jqrs.querySelectorAll('.jqrs__tip').length).toBe(0);
  });

  it('updateVertical', () => {
    view.updateVertical(false, true, scale, from, to);

    const progress = jqrs.querySelector('.jqrs__progress') as HTMLElement;

    expect(jqrs.classList.contains('jqrs_is-vertical')).toBe(true);
    expect(progress.style.top).toBe('100%');
    expect(progress.style.bottom).toBe('0%');
    expect((jqrs.querySelector('.jqrs__tick') as HTMLElement).style.bottom).toBe('0%');

    view.updateVertical(false, false, scale, from, to);

    expect(jqrs.classList.contains('jqrs_is-vertical')).toBe(false);
    expect(progress.style.right).toBe('100%');
    expect(progress.style.left).toBe('0%');
    expect((jqrs.querySelector('.jqrs__tick') as HTMLElement).style.left).toBe('0%');
  });

  it('updateScale', () => {
    view.updateScale(scale);

    const ticks: NodeListOf<HTMLElement> = jqrs.querySelectorAll('.jqrs__tick');

    expect(ticks[0].style.left).toBe('0%');
    expect(ticks[0].textContent?.trim()).toBe('0');

    expect(ticks[1].style.left).toBe('100%');
    expect(ticks[1].textContent?.trim()).toBe('1');

    view.updateScale(false);

    expect(jqrs.querySelector('.jqrs__scale')).toBe(null);
  });

  it('updateThumbs', () => {
    view.updateThumbs(false, from, to);
    view.updateTip(true);

    const thumb = jqrs.querySelector('.jqrs__thumb') as HTMLElement;
    const progress = jqrs.querySelector('.jqrs__progress') as HTMLElement;

    expect(thumb.style.left).toBe('0%');
    expect(thumb.firstElementChild?.textContent).toBe('0');

    expect(progress.style.right).toBe('100%');
    expect(progress.style.left).toBe('0%');

    view.updateDouble(true, from, to);

    const thumbs: NodeListOf<HTMLElement> = jqrs.querySelectorAll('.jqrs__thumb');

    expect(thumbs[1].style.left).toBe('100%');
    expect(thumbs[1].firstElementChild?.textContent).toBe('1');

    expect(progress.style.right).toBe('0%');
    expect(progress.style.left).toBe('0%');
  });

  it('events', () => {
    // @ts-ignore
    view.handleTrackPointerdown();

    // @ts-ignore
    view.handleFromThumbPointermove();

    // @ts-ignore
    view.handleToThumbPointermove();

    // @ts-ignore
    view.handleProgressPointerdown();

    // @ts-ignore
    view.handleScalePointerdown();

    // @ts-ignore
    view.handleWindowResize();
  });
});
