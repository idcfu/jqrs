import Subject from '../../Subject/Subject';
import Progress from './Progress';

jest.mock('../../Subject/Subject');

const jqrs = document.createElement('div');

jqrs.getBoundingClientRect = jest.fn().mockImplementation(() => ({
  top: 83,
  left: 751.5,
  width: 400,
  height: 400,
}));

document.body.append(jqrs);

const progress = new Progress(new Subject(), jqrs);
const element = jqrs.querySelector('.jqrs__progress') as HTMLElement;
const pointerdownData = new PointerEvent('pointerdown', {
  clientX: 831,
  clientY: 185,
});

it('Progress', () => {
  element.dispatchEvent(pointerdownData);

  expect(progress.subject.notify).toHaveBeenCalledWith('progressPointerdown', 19.875);

  progress.isVertical = true;
  element.dispatchEvent(pointerdownData);

  expect(progress.subject.notify).toHaveBeenCalledWith('progressPointerdown', 74.5);
});
