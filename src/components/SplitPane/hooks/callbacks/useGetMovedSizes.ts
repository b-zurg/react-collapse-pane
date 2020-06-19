import { useCallback } from 'react';
import { DragState } from '../effects/useDragState';
import { moveSizes } from '../../helpers';
import { ResizeState } from '../useSplitPaneResize';

export function useGetMovedSizes({
  sizes: originalSizes,
  isLtr,
  minSizes,
  collapsedIndices,
  isReversed,
  collapsedSize,
}: {
  sizes: number[];
  isLtr: boolean;
  minSizes: number[];
  collapsedIndices: number[];
  isReversed: boolean;
  collapsedSize: number;
}) {
  return useCallback(
    (dragState: DragState<ResizeState> | null): number[] => {
      if (!dragState) return originalSizes;
      const sizes = [...originalSizes];
      const index = dragState.extraState.index;
      const offset = isLtr ? dragState.offset : -dragState.offset;
      moveSizes({
        sizes: sizes,
        index,
        offset,
        minSizes,
        collapsedIndices,
        collapsedSize,
      });
      // must move all previously collapsed panes as well, slightly different to what happens when collapsing, though mostly identical
      if (isReversed ? offset > 0 : offset < 0) {
        for (
          let i = isReversed ? index : index + 1;
          isReversed ? i > 0 : i < sizes.length - 1;
          isReversed ? i-- : i++
        ) {
          if (collapsedIndices.includes(i)) {
            moveSizes({
              sizes,
              index: isReversed ? i - 1 : i,
              offset,
              minSizes,
              collapsedIndices,
              collapsedSize,
            });
          }
        }
      }

      return sizes;
    },
    [collapsedIndices, collapsedSize, isLtr, isReversed, minSizes, originalSizes]
  );
}
