import Subject from '../../Subject/Subject';
import Track from './Track';

jest.mock('../../Subject/Subject');

const jqrs = document.createElement('div');

jqrs.getBoundingClientRect = jest.fn().mockImplementation(() => ({
  top: 83,
  left: 751.5,
  width: 400,
  height: 400,
}));

document.body.append(jqrs);

const track = new Track(new Subject(), jqrs);
const element = jqrs.querySelector('.jqrs__track') as HTMLElement;
const pointerdownData = new PointerEvent('pointerdown', {
  clientX: 831,
  clientY: 185,
});

it('Track', () => {
  element.dispatchEvent(pointerdownData);

  expect(track.subject.notify).toHaveBeenCalledWith('trackPointerdown', 19.875);

  track.isVertical = true;
  element.dispatchEvent(pointerdownData);

  expect(track.subject.notify).toHaveBeenCalledWith('trackPointerdown', 74.5);
});
