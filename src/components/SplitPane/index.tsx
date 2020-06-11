import * as React from 'react';

import { Pane } from '../Pane';
import { Resizer } from '../Resizer';
import { ClientPosition, useDragState, DragState } from '../hooks';
const { useCallback, useRef, useState, useMemo, useEffect } = React;

const DEFAULT_MIN_SIZE = 50;

export interface SplitPaneProps {
  split?: 'horizontal' | 'vertical';
  className?: string;
  collapseButton?: React.ReactElement;
  children: React.ReactChild[];

  defaultSizes?: number[];
  minSize?: number | number[];

  onDragStarted?: () => void;
  onChange?: (sizes: number[]) => void;
  onDragFinished?: (sizes: number[]) => void;
}

export interface SplitPaneResizeOptions extends SplitPaneProps {
  split: 'horizontal' | 'vertical';
  className: string;
}

interface ResizeState {
  index: number;
}

function getNodeKey(node: React.ReactChild, index: number): string {
  if (typeof node === 'object' && node && node.key != null) {
    return 'key.' + node.key;
  }

  return 'index.' + index;
}

function getMinSize(index: number, minSizes?: number | number[]): number {
  if (typeof minSizes === 'number') {
    if (minSizes > 0) {
      return minSizes;
    }
  } else if (minSizes instanceof Array) {
    const value = minSizes[index];
    if (value > 0) {
      return value;
    }
  }

  return DEFAULT_MIN_SIZE;
}

function getDefaultSize(index: number, defaultSizes?: number[]): number {
  if (defaultSizes) {
    const value = defaultSizes[index];
    if (value >= 0) {
      return value;
    }
  }

  return 1;
}

function move(
  sizes: number[],
  index: number,
  offset: number,
  minSizes: number | number[] | undefined
): number {
  if (!offset || index < 0 || index + 1 >= sizes.length) {
    return 0;
  }

  const firstMinSize = getMinSize(index, minSizes);
  const secondMinSize = getMinSize(index + 1, minSizes);

  const firstSize = sizes[index] + offset;
  const secondSize = sizes[index + 1] - offset;

  if (offset < 0 && firstSize < firstMinSize) {
    // offset is negative, so missing and pushed are, too
    const missing = firstSize - firstMinSize;
    const pushed = move(sizes, index - 1, missing, minSizes);

    offset -= missing - pushed;
  } else if (offset > 0 && secondSize < secondMinSize) {
    const missing = secondMinSize - secondSize;
    const pushed = move(sizes, index + 1, missing, minSizes);

    offset -= missing - pushed;
  }

  sizes[index] += offset;
  sizes[index + 1] -= offset;

  return offset;
}

const defaultProps = {
  split: 'vertical' as const,
  className: '',
};

function useSplitPaneResize(
  options: SplitPaneResizeOptions
): {
  childPanes: {
    key: string;
    node: React.ReactNode;
    ref: React.RefObject<HTMLDivElement>;
    size: number;
    minSize: number;
  }[];
  resizeState: ResizeState | null;
  handleDragStart: (index: number, pos: ClientPosition) => void;
} {
  const {
    children,
    split,
    defaultSizes,
    minSize: minSizes,
    onDragStarted,
    onChange,
    onDragFinished,
  } = options;

  const [sizes, setSizes] = useState(new Map<string, number>());
  const paneRefs = useRef(new Map<string, React.RefObject<HTMLDivElement>>());

  const getMovedSizes = useCallback(
    (dragState: DragState<ResizeState> | null): number[] => {
      const collectedSizes = children.map(
        (node, index) =>
          sizes.get(getNodeKey(node, index)) ||
          getDefaultSize(index, defaultSizes)
      );

      if (dragState) {
        const {
          offset,
          extraState: { index },
        } = dragState;
        move(collectedSizes, index, offset, minSizes);
      }

      return collectedSizes;
    },
    [children, defaultSizes, minSizes, sizes]
  );

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

      if (onDragFinished) {
        onDragFinished(movedSizes);
      }
    },
    [children, getMovedSizes, onDragFinished]
  );

  const [dragState, beginDrag] = useDragState<ResizeState>(
    split,
    handleDragFinished
  );
  const movedSizes = useMemo(() => getMovedSizes(dragState), [
    dragState,
    getMovedSizes,
  ]);
  const resizeState = dragState ? dragState.extraState : null;

  useEffect(() => {
    if (onChange && dragState) {
      onChange(movedSizes);
    }
  }, [dragState, movedSizes, onChange]);

  const childPanes = useMemo(() => {
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

  const childPanesWithSizes = useMemo(
    () =>
      childPanes.map((child, index) => {
        const size = movedSizes[index];
        return { ...child, size };
      }),
    [childPanes, movedSizes]
  );

  const handleDragStart = useCallback(
    (index: number, pos: ClientPosition): void => {
      const sizeAttr = split === 'vertical' ? 'width' : 'height';

      const clientSizes = new Map(
        childPanes.map(({ key, ref }): [string, number] => {
          const size = ref.current
            ? ref.current.getBoundingClientRect()[sizeAttr]
            : 0;
          return [key, size];
        })
      );

      if (onDragStarted) {
        onDragStarted();
      }

      beginDrag(pos, { index });
      setSizes(clientSizes);
    },
    [beginDrag, childPanes, onDragStarted, split]
  );

  return { childPanes: childPanesWithSizes, resizeState, handleDragStart };
}

export const SplitPane = React.memo((props: SplitPaneProps) => {
  const options = { ...defaultProps, ...props };
  const { split, className } = options;

  const { childPanes, resizeState, handleDragStart } = useSplitPaneResize(
    options
  );

  const splitStyleProps: React.CSSProperties =
    split === 'vertical'
      ? {
          left: 0,
          right: 0,
          flexDirection: 'row',
        }
      : {
          bottom: 0,
          top: 0,
          flexDirection: 'column',
          minHeight: '100%',
          width: '100%',
        };

  const style: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    height: '100%',
    position: 'absolute',
    outline: 'none',
    overflow: 'hidden',
    ...splitStyleProps,
  };
  const classes = ['SplitPane', split, className].join(' ');

  const dragLayerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
  const dragLayerClasses = [
    'DragLayer',
    split,
    resizeState ? 'resizing' : '',
    className,
  ].join(' ');

  const entries: React.ReactNode[] = [];

  childPanes.forEach(({ key, node, ref, size, minSize }, index) => {
    if (index !== 0) {
      const resizing = resizeState && resizeState.index === index - 1;

      entries.push(
        <Resizer
          key={'resizer.' + index}
          split={split}
          className={className + (resizing ? ' resizing' : '')}
          index={index - 1}
          collapseButton={props.collapseButton}
          onDragStarted={handleDragStart}
        />
      );
    }

    entries.push(
      <Pane
        key={'pane.' + key}
        forwardRef={ref}
        size={size}
        minSize={minSize}
        split={split}
        className={className}
      >
        {node}
      </Pane>
    );
  });

  return (
    <div className={classes} style={style}>
      <div className={dragLayerClasses} style={dragLayerStyle} />
      {entries}
    </div>
  );
});
SplitPane.displayName = 'SplitPane';
