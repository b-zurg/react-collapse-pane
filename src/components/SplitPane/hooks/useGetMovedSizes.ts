import { useCallback } from 'react';
import { DragState } from './useDragState';
import { moveSizes } from '../helpers';
import { ResizeState } from './useSplitPaneResize';
import { useGetNodeSize } from './useGetNodeSize';

export function useGetMovedSizes({
  children,
  getNodeSize,
  isLtr,
  minSizes,
}: {
  children: React.ReactChild[];
  getNodeSize: ReturnType<typeof useGetNodeSize>;
  isLtr: boolean;
  minSizes: number[];
}) {
  return useCallback(
    (dragState: DragState<ResizeState> | null): number[] => {
      const collectedSizes = children.map((node, index) => getNodeSize(node, index));
      if (!dragState) return collectedSizes;
      moveSizes({
        sizes: collectedSizes,
        index: dragState.extraState.index,
        offset: isLtr ? dragState.offset : -dragState.offset,
        minSizes,
      });
      return collectedSizes;
    },
    [children, getNodeSize, isLtr, minSizes]
  );
}
