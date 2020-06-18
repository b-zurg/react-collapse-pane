import React, { useCallback } from 'react';
import { moveSizes } from '../../helpers';

export function useCollapseSize({
  isReversed,
  movedSizes,
  minSizes,
  collapsedIndices,
  setSizes,
  setMovedSizes,
  collapsedSize,
}: {
  isReversed: boolean;
  movedSizes: number[];
  minSizes: number[];
  collapsedIndices: number[];
  setSizes: React.Dispatch<React.SetStateAction<number[]>>;
  setMovedSizes: React.Dispatch<React.SetStateAction<number[]>>;
  collapsedSize: number;
}) {
  return useCallback(
    ({ size, idx }: { idx: number; size: number }) => {
      const offset = isReversed ? -(collapsedSize - size) : collapsedSize - size;
      const index = isReversed ? idx - 1 : idx;
      const newSizes = [...movedSizes];
      moveSizes({ sizes: newSizes, index, offset, minSizes, collapsedIndices, collapsedSize });

      //cascade move to collapsed siblings
      for (
        let i = isReversed ? idx : idx + 1;
        isReversed ? i > 0 : i < movedSizes.length - 1;
        isReversed ? i-- : i++
      ) {
        if (collapsedIndices.includes(i)) {
          moveSizes({
            sizes: newSizes,
            index: isReversed ? i - 2 : i,
            offset: offset,
            minSizes,
            collapsedIndices,
            collapsedSize,
          });
        }
      }
      setMovedSizes(newSizes);
      setSizes(newSizes);
    },
    [isReversed, collapsedSize, movedSizes, minSizes, collapsedIndices, setMovedSizes, setSizes]
  );
}
