import React, { useCallback } from 'react';
import { moveSizes } from '../helpers';

export function useUncollapseSize({
  isReversed,
  movedSizes,
  minSizes,
  setMovedSizes,
}: {
  isReversed: boolean;
  movedSizes: number[];
  minSizes: number[];
  setMovedSizes: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  return useCallback(
    ({ size, idx }: { size: number; idx: number }) => {
      const offset = isReversed ? -(size - 50) : size - 50;
      const index = isReversed ? idx - 1 : idx;
      const newSizes = [...movedSizes];
      moveSizes({ sizes: newSizes, index, offset, minSizes });
      setMovedSizes(newSizes);
    },
    [isReversed, minSizes, movedSizes, setMovedSizes]
  );
}
