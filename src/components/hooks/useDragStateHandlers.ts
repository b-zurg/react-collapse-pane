import * as ReactDOM from 'react-dom';
import { useEventListener } from './useEventListener';
import { useCallback, useMemo, useState } from 'react';
import { SplitType } from '../SplitPane';

export interface ClientPosition {
  clientX: number;
  clientY: number;
}

export interface DragState<T> {
  offset: number;
  extraState: T;
}

interface DragStateHandlers<T> {
  beginDrag: (pos: ClientPosition, extraState: T) => void;
  dragState: DragState<T> | null;
  onMouseMove?: (event: ClientPosition) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onMouseUp?: () => void;
}

function useDragStateHandlers<T>(
  split: SplitType,
  onDragFinished: (dragState: DragState<T>) => void
): DragStateHandlers<T> {
  const [dragging, setDragging] = useState<[T, number] | null>(null);
  const [current, setCurrent] = useState<number>(0);

  const beginDrag = useCallback(
    (event: ClientPosition, extraState: T): void => {
      const pos = split === 'vertical' ? event.clientX : event.clientY;
      setDragging([extraState, pos]);
      setCurrent(pos);
    },
    [split]
  );

  const [dragState, onMouseUp] = useMemo(() => {
    if (!dragging) {
      return [null, undefined];
    }

    const [extraState, origin] = dragging;
    const dragState: DragState<T> = { offset: current - origin, extraState };

    const onMouseUp = (): void => {
      ReactDOM.unstable_batchedUpdates(() => {
        setDragging(null);
        onDragFinished(dragState);
      });
    };

    return [dragState, onMouseUp];
  }, [current, dragging, onDragFinished]);

  const [onMouseMove, onTouchMove] = useMemo(() => {
    if (!dragging) {
      return [undefined, undefined];
    }

    const onMouseMove = (event: ClientPosition): void => {
      const pos = split === 'vertical' ? event.clientX : event.clientY;
      setCurrent(pos);
    };

    const onTouchMove = (event: TouchEvent): void => {
      onMouseMove(event.touches[0]);
    };

    return [onMouseMove, onTouchMove];
  }, [dragging, split]);

  return { beginDrag, dragState, onMouseMove, onTouchMove, onMouseUp };
}

export function useDragState<T>(
  split: SplitType,
  onDragFinished: (dragState: DragState<T>) => void
): [DragState<T> | null, (pos: ClientPosition, extraState: T) => void] {
  const { beginDrag, dragState, onMouseMove, onTouchMove, onMouseUp } = useDragStateHandlers<T>(
    split,
    onDragFinished
  );

  useEventListener('mousemove', onMouseMove);
  useEventListener('touchmove', onTouchMove);
  useEventListener('mouseup', onMouseUp);

  return [dragState, beginDrag];
}
