import React, { useCallback } from 'react';
import { BeginDragCallback, ClientPosition } from '../effects/useDragState';
import { SplitPaneHooks } from '../..';
import { useGetCurrentPaneSizes } from './useGetCurrentPaneSizes';

/**
 * Callback that starts the drag process and called at the beginning of the dragging.
 */
export function useHandleDragStart({
  isReversed,
  hooks,
  beginDrag,
  setSizes,
  getCurrentPaneSizes,
}: {
  isReversed: boolean;
  hooks?: SplitPaneHooks;
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
    [beginDrag, getCurrentPaneSizes, hooks, isReversed, setSizes]
  );
}
