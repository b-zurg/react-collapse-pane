import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getMinSize, getNodeKey } from '../helpers';
import { Direction, SplitPaneProps } from '..';
import { ClientPosition, useDragState } from './useDragState';
import { useGetMinSizes } from './useMinSizes';
import { useGetNodeSize } from './useGetNodeSize';
import { useGetMovedSizes } from './useGetMovedSizes';
import { useIsCollapseReversed } from './useIsCollapseReversed';
import { useHandleDragFinished } from './useHandleDragFinished';
import { useHandleDragStart } from './useHandleDragStart';

export interface ResizeState {
  index: number;
}

export interface ChildPane {
  key: string;
  node: React.ReactChild;
  ref: React.RefObject<HTMLDivElement>;
  size: number;
  minSize: number;
}
interface SplitPaneResizeReturns {
  childPanes: ChildPane[];
  resizeState: ResizeState | null;
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
    defaultSizes,
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
  const isReversed = useIsCollapseReversed(collapseOptions);
  const isLtr = useMemo(() => direction === 'ltr', [direction]);

  // STATE: a map keeping track of all of the pane sizes
  const [sizes, setSizes] = useState(new Map<string, number>());

  // CALLBACKS  callback functions used throughout. all functions are memoized by useCallback
  const getNodeSize = useGetNodeSize({ defaultSizes, sizes });
  const getMovedSizes = useGetMovedSizes({ minSizes, getNodeSize, children, isLtr });
  const handleDragFinished = useHandleDragFinished({ getMovedSizes, children, hooks, setSizes });

  // STATE: if dragging, contains which pane is dragging and what the offset is.  If not dragging then null
  const [dragState, beginDrag] = useDragState<ResizeState>(split, handleDragFinished);

  const resizeState = dragState?.extraState ?? null;
  const movedSizes = useMemo(() => getMovedSizes(dragState), [dragState, getMovedSizes]);

  useEffect(() => {
    if (dragState !== null) hooks?.onChange?.(movedSizes);
  }, [dragState, movedSizes, hooks]);

  // converts all children nodes into 'childPane' objects that has its ref, key, but not the size yet
  const childPanes: Omit<ChildPane, 'size'>[] = useMemo(() => {
    const prevPaneRefs = paneRefs.current;
    paneRefs.current = new Map<string, React.RefObject<HTMLDivElement>>();
    return children.map((node, index) => {
      const key = getNodeKey(node, index);

      const ref = prevPaneRefs.get(key) || React.createRef();
      paneRefs.current.set(key, ref);

      const minSize = getMinSize(index, minSizes);

      return { key, node, ref, minSize };
    });
  }, [children, minSizes]);

  const [collapsedSizes, setCollapsedSizes] = useState<Nullable<number>[]>(
    childPanes.map(_c => null)
  );
  const updateCollapsedSizes = useCallback(
    (indices: number[]) => {
      const newCollapsed = collapsedSizes.map((size, idx) => {
        const isCollapsed = indices.includes(idx);
        if (isCollapsed && size === null) {
          return movedSizes[idx];
        }
        if (!isCollapsed && size !== null) {
          const newSizes = getMovedSizes({
            offset: size,
            extraState: { index: idx },
          });
          setSizes(
            new Map(
              children.map((node, index): [string, number] => [
                getNodeKey(node, index),
                newSizes[index],
              ])
            )
          );
          return null;
        }
        return size;
      });
      setCollapsedSizes(newCollapsed);
    },
    [collapsedSizes, movedSizes]
  );
  // only want to run this effect when a collapse changes
  useEffect(() => updateCollapsedSizes(collapsedIndices), [collapsedIndices]);

  //populates the sizes of all the initially populated childPanes, adjust sizes based on collapsed state
  const childPanesWithSizes = useMemo(
    () =>
      childPanes.map((child, index) => {
        const prevIndex = isReversed ? index + 1 : index - 1;
        const isPrevCollapsed = collapsedIndices.includes(prevIndex);
        const isCurCollapsed = collapsedIndices.includes(index);
        const collapseSize = collapseOptions?.collapseSize ?? 0;
        const prevSize = isPrevCollapsed ? movedSizes[prevIndex] - collapseSize : 0;
        const curSize = isCurCollapsed ? collapseSize : movedSizes[index];
        const size = prevSize + curSize;
        return { ...child, size };
      }),
    [childPanes, collapseOptions, collapsedIndices, isReversed, movedSizes]
  );

  const handleDragStart = useHandleDragStart({
    setSizes,
    isReversed,
    hooks,
    split,
    childPanes,
    beginDrag,
  });
  return { childPanes: childPanesWithSizes, resizeState, handleDragStart };
}
