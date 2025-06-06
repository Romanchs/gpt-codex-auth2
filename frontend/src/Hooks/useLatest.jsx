import { useLayoutEffect, useRef } from 'react';

export const useLatest = (value) => {
  const latestValue = useRef(value);

  useLayoutEffect(() => {
    latestValue.current = value;
  });

  return latestValue;
};
