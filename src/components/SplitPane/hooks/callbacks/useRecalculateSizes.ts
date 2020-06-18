import { getMinSize, moveSizes } from '../../helpers';
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
  return useCallback(() => {
    const curSizes = getCurrentPaneSizes();
    const adjustedSizes = curSizes.map((size, idx) => {
      if (collapsedIndices.includes(idx)) {
        return collapsedSize;
      }
      if (collapsedIndices.includes(idx - 1)) {
        return size + curSizes[idx - 1] - collapsedSize;
      }
      return size;
    });
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
  }, [
    collapsedIndices,
    collapsedSize,
    getCurrentPaneSizes,
    minSizes,
    originalMinSizes,
    setMovedSizes,
    setSizes,
  ]);
}
