import { useCallback, useRef } from 'react';

export const useThrottle = <T, U extends any[]>(
  fn: (...args: U) => T,
  wait: number,
  option = { leading: true, trailing: true },
) => {
  const timerId = useRef<any>(); // track the timer
  const lastArgs = useRef<any>(); // track the args

  // create a memoized debounce
  const throttle = useCallback(
    function (...args: U) {
      const { trailing, leading } = option;
      // function for delayed call
      const waitFunc = () => {
        // if trailing invoke the function and start the timer again
        if (trailing && lastArgs.current) {
          fn(...lastArgs.current);
          lastArgs.current = null;
          timerId.current = setTimeout(waitFunc, wait);
        } else {
          // else reset the timer
          timerId.current = null;
        }
      };

      // if leading run it right away
      if (!timerId.current && leading) {
        fn(...args);
      }
      // else store the args
      else {
        lastArgs.current = args;
      }

      // run the delayed call
      if (!timerId.current) {
        timerId.current = setTimeout(waitFunc, wait);
      }
    },
    [fn, wait, option],
  );

  return throttle;
};
