import Subject from '../../Subject/Subject';
import Thumb from './Thumb';

jest.mock('../../Subject/Subject');

const jqrs = document.createElement('div');

jqrs.getBoundingClientRect = jest.fn().mockImplementation(() => ({
  top: 83,
  left: 751.5,
  width: 400,
  height: 400,
}));

document.body.append(jqrs);

const thumb = new Thumb(new Subject(), jqrs, 'from');
thumb.render();

const element = jqrs.querySelector('.jqrs__thumb') as HTMLElement;
const pointermoveData = new PointerEvent('pointermove', {
  clientX: 831,
  clientY: 185,
});

it('Thumb', () => {
  element.dispatchEvent(new PointerEvent('pointerdown'));

  expect(element.classList.contains('jqrs__thumb_is-active')).toBe(true);

  element.dispatchEvent(pointermoveData);

  expect(thumb.subject.notify).toHaveBeenCalledWith('fromThumbPointermove', 19.875);

  thumb.isVertical = true;
  element.dispatchEvent(pointermoveData);

  expect(thumb.subject.notify).toHaveBeenCalledWith('fromThumbPointermove', 74.5);

  element.dispatchEvent(new PointerEvent('pointerup'));

  expect(element.classList.contains('jqrs__thumb_is-active')).toBe(false);
});
