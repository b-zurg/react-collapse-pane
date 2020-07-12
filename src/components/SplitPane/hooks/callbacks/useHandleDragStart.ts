import { useCallback } from 'react';
import { BeginDragCallback, ClientPosition } from '../effects/useDragState';
import { SplitPaneHooks } from '../..';

/**
 * Callback that starts the drag process and called at the beginning of the dragging.
 */
export function useHandleDragStart({
  isReversed,
  hooks,
  beginDrag,
}: {
  isReversed: boolean;
  hooks?: SplitPaneHooks;
  beginDrag: BeginDragCallback;
}) {
  return useCallback(
    ({ index, position }: { index: number; position: ClientPosition }): void => {
      hooks?.onDragStarted?.();
      beginDrag({ position, index: isReversed ? index - 1 : index });
    },
    [beginDrag, hooks, isReversed]
  );
}
