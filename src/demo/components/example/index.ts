import Example from './Example';
import examples from './examples.json';

examples.forEach(({ id, min, max, step, from, to, isDouble, hasTip, hasScale, isVertical }) => {
  new Example(id, {
    min,
    max,
    step,
    from,
    to,
    isDouble,
    hasTip,
    hasScale,
    isVertical,
  });
});
