import * as React from 'react';
import {
  getDefaultSize,
  getMinSize,
  getNodeKey,
  isCollapseDirectionReversed,
  moveSizes,
  getRefSize,
} from '../components/SplitPane/helpers';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Direction, SplitPaneProps } from '../components/SplitPane';
import { ClientPosition, DragState, useDragState } from './useDragStateHandlers';

interface ResizeState {
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
    minSizes,
    hooks,
    collapsedIndices,
    collapseOptions,
    direction,
  } = options;
  const isReversed = useMemo(() => isCollapseDirectionReversed(collapseOptions), [collapseOptions]);

  // a map keeping track of all of the pane sizes e.g. {"index.0" => 324.671875, "index.1" => 262.671875, "index.2" => 167.671875}
  const [sizes, setSizes] = useState(new Map<string, number>());
  // const [collapsedSizes, setCollapsedSizes] = useState(new Map<number, number>());
  const paneRefs = useRef(new Map<string, React.RefObject<HTMLDivElement>>());
  const getNodeSize = useCallback(
    (node: React.ReactChild, index: number) =>
      sizes.get(getNodeKey(node, index)) || getDefaultSize({ index, defaultSizes }),
    [defaultSizes, sizes]
  );
  const minSizesMapped = useMemo(() => children.map((_child, idx) => getMinSize(idx, minSizes)), [
    children,
    minSizes,
  ]);

  const isLtr = useMemo(() => direction === 'ltr', [direction]);
  const getMovedSizes = useCallback(
    (dragState: DragState<ResizeState> | null): number[] => {
      const collectedSizes = children.map((node, index) => getNodeSize(node, index));
      if (!dragState) return collectedSizes;
      return moveSizes({
        sizes: collectedSizes,
        index: dragState.extraState.index,
        offset: dragState.offset,
        minSizes: minSizesMapped,
        isLtr,
        collapsedIndices,
      });
    },
    [children, collapsedIndices, getNodeSize, isLtr, minSizesMapped]
  );
  // called at the end of a drag, sets the final size as well as runs the callback hook
  const handleDragFinished = useCallback(
    (dragState: DragState<ResizeState>) => {
      const movedSizes = getMovedSizes(dragState);
      setSizes(
        new Map(
          children.map((node, index): [string, number] => [
            getNodeKey(node, index),
            movedSizes[index],
          ])
        )
      );
      hooks?.onDragFinished?.(movedSizes);
    },
    [children, getMovedSizes, hooks]
  );

  // the dragstate contains which pane is dragging and what the offset is.  Is null if not dragging
  const [dragState, beginDrag] = useDragState<ResizeState>(split, handleDragFinished);
  const movedSizes = useMemo(() => getMovedSizes(dragState), [dragState, getMovedSizes]);

  const resizeState = dragState?.extraState ?? null;

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

  const handleDragStart = useCallback(
    (index: number, pos: ClientPosition): void => {
      const clientSizes = new Map(
        childPanes.map(({ key, ref }): [string, number] => {
          const calculatedSize = getRefSize({ split, ref });
          const size = calculatedSize;
          return [key, size];
        })
      );

      hooks?.onDragStarted?.();
      beginDrag(pos, { index: isReversed ? index - 1 : index });
      setSizes(clientSizes);
    },
    [beginDrag, childPanes, hooks, isReversed, split]
  );

  return { childPanes: childPanesWithSizes, resizeState, handleDragStart };
}
