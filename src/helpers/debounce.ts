const debounce = function (callback: Function, delay: number): (...args: unknown[]) => void {
  let timer: number | undefined;

  return function (...args: unknown[]): void {
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(() => callback(args), delay);
  };
};

export default debounce;
