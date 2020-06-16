import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Direction, SplitPaneProps } from '..';
import { ClientPosition, useDragState } from './effects/useDragState';
import { useMinSizes } from './memos/useMinSizes';
import { useGetMovedSizes } from './callbacks/useGetMovedSizes';
import { useIsCollapseReversed } from './memos/useIsCollapseReversed';
import { useHandleDragFinished } from './callbacks/useHandleDragFinished';
import { useHandleDragStart } from './callbacks/useHandleDragStart';
import { useChildPanes } from './memos/useChildPanes';
import { useGetCurrentPaneSizes } from './callbacks/useGetCurrentPaneSizes';
import { useCollapseSize } from './callbacks/useCollapseSize';
import { useUncollapseSize } from './callbacks/useUncollapseSize';
import { useUpdateCollapsedSizes } from './callbacks/useUpdateCollapsedSizes';

export interface ResizeState {
  index: number;
}

export interface ChildPane {
  node: React.ReactChild;
  ref: React.RefObject<HTMLDivElement>;
  key: string;
  size: number;
  minSize: number;
}
interface SplitPaneResizeReturns {
  childPanes: ChildPane[];
  resizeState: Nullable<ResizeState>;
  handleDragStart: (index: number, pos: ClientPosition) => void;
}

interface SplitPaneResizeOptions
  extends Pick<
    SplitPaneProps,
    'children' | 'split' | 'defaultSizes' | 'minSizes' | 'hooks' | 'collapseOptions' | 'direction'
  > {
  collapsedIndices: number[];
  direction: Direction;
}

/**
 * Manages the dragging, size calculation, collapse calculation, and general state management of the panes.  It propogates the results of its complex calculations into the `childPanes` which are used by the rest of the "dumb" react components that just take all of them and render them
 */
export function useSplitPaneResize(options: SplitPaneResizeOptions): SplitPaneResizeReturns {
  const {
    children,
    split,
    defaultSizes: originalDefaults,
    minSizes: originalMinSizes,
    hooks,
    collapsedIndices,
    collapseOptions,
    direction,
  } = options;

  // VALUES: const values used throughout the different logic
  const paneRefs = useRef(new Map<string, React.RefObject<HTMLDivElement>>());
  const minSizes = useMinSizes({
    minSizes: originalMinSizes,
    children,
    collapseOptions,
    collapsedIndices,
  });
  const childPanes = useChildPanes({ minSizes, children, paneRefs });
  const isReversed = useIsCollapseReversed(collapseOptions);
  const isLtr = useMemo(() => direction === 'ltr', [direction]);
  const defaultSizes = useMemo(() => children.map((_c, idx) => originalDefaults?.[idx] ?? 1), [
    originalDefaults,
    children,
  ]);

  // STATE: a map keeping track of all of the pane sizes
  const [sizes, setSizes] = useState<number[]>(defaultSizes);
  const [movedSizes, setMovedSizes] = useState<number[]>(sizes);
  const [collapsedSizes, setCollapsedSizes] = useState<Nullable<number>[]>(
    collapseOptions?.collapsedSizes ?? new Array(children.length).fill(null)
  );
  // CALLBACKS  callback functions used throughout. all functions are memoized by useCallback
  const getMovedSizes = useGetMovedSizes({ minSizes, sizes, isLtr });
  const getCurrentPaneSizes = useGetCurrentPaneSizes({ childPanes, split });
  const handleDragFinished = useHandleDragFinished({ getMovedSizes, children, hooks, setSizes });

  // STATE: if dragging, contains which pane is dragging and what the offset is.  If not dragging then null
  const [dragState, beginDrag] = useDragState<ResizeState>(split, handleDragFinished);

  const resizeState = dragState?.extraState ?? null;

  const collapseSize = useCollapseSize({
    setMovedSizes,
    setSizes,
    minSizes,
    movedSizes,
    isReversed,
    collapsedIndices,
  });
  const unCollapseSize = useUncollapseSize({
    isReversed,
    movedSizes,
    minSizes,
    setMovedSizes,
    setSizes,
  });
  const updateCollapsedSizes = useUpdateCollapsedSizes({
    sizes,
    collapsedSizes,
    setCollapsedSizes,
    movedSizes,
    collapseSize,
    unCollapseSize,
    hooks,
  });

  // EFFECTS: manage updates and calculations based on dependency changes for states that are interacted with by multiple functions
  useEffect(() => {
    setMovedSizes(getMovedSizes(dragState));
  }, [dragState, getMovedSizes]);
  useEffect(() => {
    if (dragState !== null) hooks?.onChange?.(movedSizes);
  }, [dragState, movedSizes, hooks]);
  useEffect(() => {
    updateCollapsedSizes(collapsedIndices);
    hooks?.onCollapse?.(collapsedSizes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsedIndices]);
  useEffect(() => {
    const curSizes = getCurrentPaneSizes();
    setMovedSizes(curSizes);
    setSizes(curSizes);
  }, [getCurrentPaneSizes]);

  //populates the sizes of all the initially populated childPanes, adjust sizes based on collapsed state
  const childPanesWithSizes = useMemo(
    () =>
      childPanes.map((child, index) => {
        return { ...child, size: movedSizes[index] };
      }),
    [childPanes, movedSizes]
  );

  const handleDragStart = useHandleDragStart({
    setSizes,
    isReversed,
    hooks,
    split,
    childPanes,
    beginDrag,
    getCurrentPaneSizes,
  });
  return { childPanes: childPanesWithSizes, resizeState, handleDragStart };
}
