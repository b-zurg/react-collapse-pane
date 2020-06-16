import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Direction, SplitPaneProps } from '..';
import { ClientPosition, useDragState } from './useDragState';
import { useGetMinSizes } from './useMinSizes';
import { useGetMovedSizes } from './useGetMovedSizes';
import { useIsCollapseReversed } from './useIsCollapseReversed';
import { useHandleDragFinished } from './useHandleDragFinished';
import { useHandleDragStart } from './useHandleDragStart';
import { useChildPanes } from './useChildPanes';
import { useGetCurrentPaneSizes } from './useGetCurrentPaneSizes';

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
  const minSizes = useGetMinSizes({
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

  // CALLBACKS  callback functions used throughout. all functions are memoized by useCallback
  const getMovedSizes = useGetMovedSizes({ minSizes, sizes, isLtr });
  const getCurrentPaneSizes = useGetCurrentPaneSizes({ childPanes, split });
  const handleDragFinished = useHandleDragFinished({ getMovedSizes, children, hooks, setSizes });

  // STATE: if dragging, contains which pane is dragging and what the offset is.  If not dragging then null
  const [dragState, beginDrag] = useDragState<ResizeState>(split, handleDragFinished);

  const resizeState = dragState?.extraState ?? null;
  // const movedSizes = useMemo(() => getMovedSizes(dragState), [dragState, getMovedSizes]);
  useEffect(() => {
    setMovedSizes(getMovedSizes(dragState));
  }, [dragState, getMovedSizes]);
  useEffect(() => {
    if (dragState !== null) hooks?.onChange?.(movedSizes);
  }, [dragState, movedSizes, hooks]);

  const [collapsedSizes, setCollapsedSizes] = useState<Nullable<number>[]>(
    new Array(children.length).fill(null)
  );
  const updateCollapsedSizes = useCallback(
    (indices: number[]) => {
      const newCollapsed = collapsedSizes.map((size, idx) => {
        const isCollapsed = indices.includes(idx);
        if (isCollapsed && size === null) {
          const offset = isLtr ? 50 - sizes[idx] : -(50 - sizes[idx]);
          setMovedSizes(getMovedSizes({ extraState: { index: idx }, offset }));
          return movedSizes[idx]; // when collapsed set size to current
        }
        if (!isCollapsed && size !== null) {
          // setMovedSizes(getMovedSizes({ extraState: { index: idx + 1 }, offset: size - 50 }));
          return null; // when uncollapsed clear size
        }
        return size;
      });
      setCollapsedSizes(newCollapsed);
    },
    [collapsedSizes, getMovedSizes, movedSizes, sizes]
  );

  // only want to run this effect when a collapse changes
  useEffect(() => {
    updateCollapsedSizes(collapsedIndices);
  }, [collapsedIndices]);

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
