import React, { useCallback } from 'react';
import { DragState } from '../effects/useDragState';
import { ResizeState } from '../useSplitPaneResize';
import { useGetMovedSizes } from './useGetMovedSizes';
import { SplitPaneHooks } from '../..';

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
  setSizes: React.Dispatch<React.SetStateAction<number[]>>;
  getMovedSizes: ReturnType<typeof useGetMovedSizes>;
  hooks?: SplitPaneHooks;
}) {
  return useCallback(
    (dragState: DragState<ResizeState>) => {
      const movedSizes = getMovedSizes(dragState);
      setSizes(movedSizes);
      hooks?.onDragFinished?.(movedSizes);
    },
    [children, getMovedSizes, hooks, setSizes]
  );
}
