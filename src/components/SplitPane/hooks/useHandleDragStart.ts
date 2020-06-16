import React, { useCallback } from 'react';
import { BeginDragCallback, ClientPosition } from './useDragState';
import { ChildPane } from './useSplitPaneResize';
import { SplitPaneHooks, SplitType } from '../index';
import { useGetCurrentPaneSizes } from './useGetCurrentPaneSizes';

/**
 * Callback that starts the drag process and called at the beginning of the dragging.
 */
export function useHandleDragStart({
  isReversed,
  hooks,
  childPanes,
  split,
  beginDrag,
  setSizes,
  getCurrentPaneSizes,
}: {
  isReversed: boolean;
  childPanes: Omit<ChildPane, 'size'>[];
  hooks?: SplitPaneHooks;
  split: SplitType;
  beginDrag: BeginDragCallback<any>;
  setSizes: React.Dispatch<React.SetStateAction<number[]>>;
  getCurrentPaneSizes: ReturnType<typeof useGetCurrentPaneSizes>;
}) {
  return useCallback(
    (index: number, pos: ClientPosition): void => {
      const clientSizes = getCurrentPaneSizes();
      hooks?.onDragStarted?.();
      beginDrag(pos, { index: isReversed ? index - 1 : index });
      setSizes(clientSizes);
    },
    [beginDrag, childPanes, hooks, isReversed, split]
  );
}
