import { useCallback } from 'react';
import { DragState } from '../effects/useDragState';
import { moveSizes } from '../../helpers';
import { ResizeState } from '../useSplitPaneResize';

export function useGetMovedSizes({
  sizes: originalSizes,
  isLtr,
  minSizes,
}: {
  sizes: number[];
  isLtr: boolean;
  minSizes: number[];
}) {
  return useCallback(
    (dragState: DragState<ResizeState> | null): number[] => {
      if (!dragState) return originalSizes;
      const sizes = [...originalSizes];
      moveSizes({
        sizes: sizes,
        index: dragState.extraState.index,
        offset: isLtr ? dragState.offset : -dragState.offset,
        minSizes,
      });
      return sizes;
    },
    [isLtr, minSizes, originalSizes]
  );
}
