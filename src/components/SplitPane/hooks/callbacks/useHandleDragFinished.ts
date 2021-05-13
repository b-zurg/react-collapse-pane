import React, { useCallback } from 'react';
import { SplitPaneHooks } from '../..';

/**
 * called at the end of a drag, sets the final size as well as runs the callback hook
 */
export const useHandleDragFinished = ({
  setSizes,
  hooks,
  movedSizes,
}: {
  children: React.ReactChild[];
  setSizes: React.Dispatch<React.SetStateAction<number[]>>;
  movedSizes: number[];
  hooks?: SplitPaneHooks;
}) =>
  useCallback(() => {
    setSizes(movedSizes);
    hooks?.onSaveSizes?.(movedSizes);
  }, [movedSizes, hooks, setSizes]);
