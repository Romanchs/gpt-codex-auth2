import { debounce } from 'lodash';
import { useEffect, useMemo } from 'react';

import { useLatest } from './useLatest';

export const useDebounce = (cb, ms = 1000) => {
  const latestCb = useLatest(cb);

  const debouncedFn = useMemo(
    () =>
      debounce((...args) => {
        latestCb.current(...args);
      }, ms),
    [ms, latestCb]
  );

  useEffect(() => () => debouncedFn.cancel(), [debouncedFn]);

  return debouncedFn;
};
