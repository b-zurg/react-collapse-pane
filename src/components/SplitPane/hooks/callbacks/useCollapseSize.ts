import React, { useCallback } from 'react';
import { moveSizes } from '../../helpers';

export function useCollapseSize({
  isReversed,
  movedSizes,
  minSizes,
  collapsedIndices,
  setSizes,
  setMovedSizes,
}: {
  isReversed: boolean;
  movedSizes: number[];
  minSizes: number[];
  collapsedIndices: number[];
  setSizes: React.Dispatch<React.SetStateAction<number[]>>;
  setMovedSizes: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  return useCallback(
    ({ size, idx }: { idx: number; size: number }) => {
      const offset = isReversed ? -(50 - size) : 50 - size;
      const index = isReversed ? idx - 1 : idx;
      const newSizes = [...movedSizes];
      moveSizes({ sizes: newSizes, index, offset, minSizes });
      if (collapsedIndices.includes(isReversed ? idx - 1 : idx + 1)) {
        // this should be a loop, right now only takes care of "left" pane to the current one
        moveSizes({
          sizes: newSizes,
          index: isReversed ? idx - 2 : idx + 1,
          offset: offset,
          minSizes,
        });
      }
      setMovedSizes(newSizes);
      setSizes(newSizes);
    },
    [isReversed, movedSizes, minSizes, collapsedIndices, setMovedSizes, setSizes]
  );
}
