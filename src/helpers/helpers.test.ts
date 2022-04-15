import { debounce, importAll } from './helpers';

describe('helpers', () => {
  it('debounce', () => {
    jest.useFakeTimers();

    let count = 0;

    const increment = debounce(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      count += 1;
    }, 100);

    increment();
    increment();

    expect(count).toBe(0);

    jest.advanceTimersToNextTimer();

    expect(count).toBe(1);
  });

  it('importAll', () => {
    const callback = (): () => true => () => true;
    callback.keys = (): [] => [];

    // @ts-ignore
    importAll(callback);
  });
});
