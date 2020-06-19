import { addArray, getMinSize, moveSizes } from '../../helpers';
import React, { useCallback } from 'react';

export function useRecalculateSizes({
  getCurrentPaneSizes,
  collapsedSize,
  collapsedIndices,
  originalMinSizes,
  minSizes,
  setMovedSizes,
  setSizes,
}: {
  getCurrentPaneSizes: () => number[];
  collapsedIndices: number[];
  collapsedSize: number;
  originalMinSizes: number | number[] | undefined;
  minSizes: number[];
  setMovedSizes: React.Dispatch<React.SetStateAction<number[]>>;
  setSizes: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  return useCallback(
    (initialSizes?: number[]) => {
      const curSizes = getCurrentPaneSizes();
      const ratio =
        initialSizes && initialSizes.length > 0 ? addArray(curSizes) / addArray(initialSizes) : 1;
      const initialRatioSizes = initialSizes ? initialSizes.map(size => size * ratio) : curSizes;
      const adjustedSizes = initialRatioSizes.map((size, idx) => {
        if (collapsedIndices.includes(idx)) {
          return collapsedSize;
        }
        if (collapsedIndices.includes(idx - 1)) {
          return size + curSizes[idx - 1] - collapsedSize;
        }
        return size;
      });
      console.log('adjusted', adjustedSizes);
      curSizes.forEach((_size, idx) => {
        const offset = curSizes[idx] - getMinSize(idx, originalMinSizes);
        // if offset is negative this means the min size is greater and we need to move this guy
        if (offset < 0) {
          moveSizes({
            collapsedIndices,
            collapsedSize,
            sizes: adjustedSizes,
            index: idx,
            offset: -offset,
            minSizes,
          });
        }
      });
      setMovedSizes(adjustedSizes);
      setSizes(adjustedSizes);
    },
    [
      collapsedIndices,
      collapsedSize,
      getCurrentPaneSizes,
      minSizes,
      originalMinSizes,
      setMovedSizes,
      setSizes,
    ]
  );
}
