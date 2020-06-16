import React, { useCallback } from 'react';
import { BeginDragCallback, ClientPosition } from './useDragState';
import { getRefSize } from '../helpers';
import { ChildPane } from './useSplitPaneResize';
import { SplitPaneHooks, SplitType } from '../index';

/**
 * Callback that starts the drag process and called at the beginning of the dragging.
 * @param isReversed
 * @param hooks
 * @param childPanes
 * @param split
 * @param beginDrag
 * @param setSizes
 */
export function useHandleDragStart({
  isReversed,
  hooks,
  childPanes,
  split,
  beginDrag,
  setSizes,
}: {
  isReversed: boolean;
  childPanes: Omit<ChildPane, 'size'>[];
  hooks?: SplitPaneHooks;
  split: SplitType;
  beginDrag: BeginDragCallback<any>;
  setSizes: React.Dispatch<React.SetStateAction<Map<string, number>>>;
}) {
  return useCallback(
    (index: number, pos: ClientPosition): void => {
      const clientSizes = new Map(
        childPanes.map(({ key, ref }): [string, number] => {
          const size = getRefSize({ split, ref });
          return [key, size];
        })
      );

      hooks?.onDragStarted?.();
      beginDrag(pos, { index: isReversed ? index - 1 : index });
      setSizes(clientSizes);
    },
    [beginDrag, childPanes, hooks, isReversed, split]
  );
}
