import { useCallback } from 'react';
import { DragState } from '../effects/useDragState';
import { moveCollapsedSiblings, moveSizes } from '../../helpers';

export const useGetMovedSizes = ({
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
}) =>
  useCallback(
    (dragState: DragState): number[] => {
      const sizes = [...originalSizes];
      const index = dragState.index;
      const offset = isLtr ? dragState.offset : -dragState.offset;
      moveSizes({
        sizes,
        index,
        offset,
        minSizes,
        collapsedIndices,
        collapsedSize,
      });
      moveCollapsedSiblings({
        collapsedSize,
        sizes,
        minSizes,
        collapsedIndices,
        isReversed,
        index,
        offset,
      });

      return sizes;
    },
    [collapsedIndices, collapsedSize, isLtr, isReversed, minSizes, originalSizes]
  );
