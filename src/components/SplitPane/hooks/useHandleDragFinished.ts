import React, { useCallback } from 'react';
import { DragState } from './useDragState';
import { getNodeKey } from '../helpers';
import { ResizeState } from './useSplitPaneResize';
import { useGetMovedSizes } from './useGetMovedSizes';
import { SplitPaneHooks } from '../index';

/**
 * called at the end of a drag, sets the final size as well as runs the callback hook
 */
export function useHandleDragFinished({
  children,
  setSizes,
  hooks,
  getMovedSizes,
}: {
  children: React.ReactChild[];
  setSizes: React.Dispatch<React.SetStateAction<Map<string, number>>>;
  getMovedSizes: ReturnType<typeof useGetMovedSizes>;
  hooks?: SplitPaneHooks;
}) {
  return useCallback(
    (dragState: DragState<ResizeState>) => {
      const movedSizes = getMovedSizes(dragState);
      setSizes(
        new Map(
          children.map((node, index): [string, number] => [
            getNodeKey(node, index),
            movedSizes[index],
          ])
        )
      );
      hooks?.onDragFinished?.(movedSizes);
    },
    [children, getMovedSizes, hooks, setSizes]
  );
}
