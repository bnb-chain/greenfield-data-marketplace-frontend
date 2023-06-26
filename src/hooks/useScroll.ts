import { RefObject, useEffect, useState } from 'react';

import { off, on } from '../utils/event';

export interface State {
  x: number;
  y: number;
}

const useScroll = (
  ref: RefObject<HTMLElement>,
  fn: (x: number, y: number) => void,
): State => {
  if (process.env.NODE_ENV === 'development') {
    if (typeof ref !== 'object' || typeof ref.current === 'undefined') {
      console.error('`useScroll` expects a single ref argument.');
    }
  }

  const [state, setState] = useState<State>({
    x: 0,
    y: 0,
  });
  useEffect(() => {
    const handler = () => {
      if (ref.current) {
        fn(ref.current.scrollLeft, ref.current.scrollTop);
        setState({
          x: ref.current.scrollLeft,
          y: ref.current.scrollTop,
        });
      }
    };

    if (ref.current) {
      on(ref.current, 'scroll', handler, {
        capture: false,
        passive: true,
      });
    }

    return () => {
      if (ref.current) {
        off(ref.current, 'scroll', handler);
      }
    };
  }, [ref]);

  return state;
};

export default useScroll;
