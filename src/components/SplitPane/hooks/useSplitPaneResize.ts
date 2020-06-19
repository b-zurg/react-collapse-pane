import * as React from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { SplitPaneProps } from '..';
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
import { useCollapsedSize } from './memos/useCollapsedSize';
import { debounce } from '../helpers';
import { useRecalculateSizes } from './callbacks/useRecalculateSizes';
import { useEventListener } from '../../../hooks/useEventListener';

export interface ResizeState {
  index: number;
}

export interface ChildPane {
  node: React.ReactChild;
  ref: React.RefObject<HTMLDivElement>;
  key: string;
  size: number;
}
interface SplitPaneResizeReturns {
  childPanes: ChildPane[];
  resizeState: Nullable<ResizeState>;
  handleDragStart: (index: number, pos: ClientPosition) => void;
}

interface SplitPaneResizeOptions
  extends Pick<
    SplitPaneProps,
    | 'children'
    | 'split'
    | 'initialSizes'
    | 'hooks'
    | 'collapseOptions'
    | 'collapsedSizes'
    | 'minSizes'
  > {
  collapsedIndices: number[];
  isLtr: boolean;
}

/**
 * Manages the dragging, size calculation, collapse calculation, and general state management of the panes.  It propogates the results of its complex calculations into the `childPanes` which are used by the rest of the "dumb" react components that just take all of them and render them
 */
export function useSplitPaneResize(options: SplitPaneResizeOptions): SplitPaneResizeReturns {
  const {
    children,
    split,
    initialSizes: originalDefaults,
    minSizes: originalMinSizes,
    hooks,
    collapsedIndices,
    collapsedSizes: originalCollapsedSizes,
    collapseOptions,
    isLtr,
  } = options;

  // VALUES: const values used throughout the different logic
  const paneRefs = useRef(new Map<string, React.RefObject<HTMLDivElement>>());

  const minSizes = useMinSizes({
    minSizes: originalMinSizes,
    children: children,
    collapseOptions: collapseOptions,
    collapsedIndices,
  });
  const collapsedSize = useCollapsedSize({ collapseOptions });
  const childPanes = useChildPanes({ minSizes, children, paneRefs });
  const isReversed = useIsCollapseReversed(collapseOptions);
  const initialSizes = useMemo(() => children.map((_c, idx) => originalDefaults?.[idx] ?? 1), [
    children,
    originalDefaults,
  ]);

  // STATE: a map keeping track of all of the pane sizes
  const [sizes, setSizes] = useState<number[]>(initialSizes);
  const [movedSizes, setMovedSizes] = useState<number[]>(sizes);
  const [collapsedSizes, setCollapsedSizes] = useState<Nullable<number>[]>(
    originalCollapsedSizes ?? new Array(children.length).fill(null)
  );
  // CALLBACKS  callback functions used throughout. all functions are memoized by useCallback
  const getMovedSizes = useGetMovedSizes({
    minSizes,
    sizes,
    isLtr,
    collapsedSize,
    collapsedIndices,
  });
  const getCurrentPaneSizes = useGetCurrentPaneSizes({ childPanes, split });
  const handleDragFinished = useHandleDragFinished({ getMovedSizes, children, hooks, setSizes });
  const recalculateSizes = useRecalculateSizes({
    setMovedSizes,
    minSizes,
    collapsedIndices,
    collapsedSize,
    getCurrentPaneSizes,
    setSizes,
    originalMinSizes,
  });

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
    collapsedSize,
  });
  const unCollapseSize = useUncollapseSize({
    isReversed,
    movedSizes,
    minSizes,
    setMovedSizes,
    setSizes,
    collapsedSize,
    collapsedIndices,
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
    hooks?.onCollapse?.(collapsedSizes);
  }, [collapsedSizes, hooks]);
  useEffect(() => {
    updateCollapsedSizes(collapsedIndices);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collapsedIndices]);
  // recalculate initial sizes on window size change to maintain min sizes

  const resetSizes = useMemo(() => debounce(() => recalculateSizes(), 50), [recalculateSizes]);
  // window.addEventListener('resize', () => resetSizes());
  useEventListener('resize', resetSizes);
  useEffect(
    () => recalculateSizes(initialSizes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  //populates the sizes of all the initially populated childPanes, adjust sizes based on collapsed state
  const childPanesWithSizes: ChildPane[] = useMemo(
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
    beginDrag,
    getCurrentPaneSizes,
  });
  return { childPanes: childPanesWithSizes, resizeState, handleDragStart };
}
