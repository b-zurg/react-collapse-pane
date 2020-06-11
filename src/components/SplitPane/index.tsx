import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  forwardRef,
  useState,
  useImperativeHandle,
} from 'react';
import styled from 'styled-components';
import { Pane, PaneRef } from '../Pane';
import { Resizer } from '../Resizer';
import {
  removeNullChildren,
  unFocus,
  Size,
  getDefaultSize,
  getSizeUpdate,
  getDocument,
  getWindow,
} from '../helpers';

const ColumnStyle = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  flex: 1;
  outline: none;
  overflow: hidden;
  user-select: text;
  position: absolute;
`;

const RowStyle = styled.div`
  display: flex;
  height: 100%;
  flex-direction: row;
  flex: 1;
  outline: none;
  overflow: hidden;
  user-select: text;
  position: absolute;
`;

export type Split = 'vertical' | 'horizontal';

export type SplitPaneProps = {
  allowResize: boolean;
  split: Split;
  minSize: Size;
  maxSize?: Size;
  defaultSize?: Size;
  size?: Size;
  onChange?: (newSize: number) => void;
  onResizerClick?: React.MouseEventHandler;
  onResizerDoubleClick?: React.MouseEventHandler;
  step?: number;
} & React.PropsWithChildren<HTMLDivElement>;

export interface SplitPaneState {
  active: boolean;
  resized: boolean;
  pane1Size: string | number | undefined;
  pane2Size: string | number | undefined;
  draggedSize: number | undefined;
  position: number | undefined;
  instanceProps: {
    size: string | number | undefined;
  };
}

export const SplitPane = forwardRef<PaneRef, SplitPaneProps>(
  (
    {
      allowResize = true,
      minSize = 50,
      split = 'vertical',
      maxSize,
      defaultSize,
      size,
      onChange,
      onResizerClick,
      onResizerDoubleClick,
      step,
      ...restOfProps
    },
    forwardedRef
  ) => {
    const splitPane = React.useRef<PaneRef>(null);
    const pane1 = useRef<PaneRef>(null);
    const pane2 = useRef<PaneRef>(null);

    const document = getDocument(splitPane);
    const window = getWindow(document);

    // forward local ref to the forwarded ref if any
    useImperativeHandle(
      forwardedRef,
      () => {
        return splitPane.current as HTMLDivElement;
      },
      [splitPane]
    );

    const [state, setState] = useState<SplitPaneState>(() => {
      const initialSize =
        size !== undefined
          ? size
          : getDefaultSize(defaultSize, minSize, maxSize, undefined);

      return {
        active: false,
        resized: false,
        draggedSize: undefined,
        position: undefined,
        pane1Size: initialSize,
        pane2Size: undefined,

        // these are props that are needed in static functions. ie: gDSFP
        instanceProps: { size },
      };
    });

    const onTouchStart = useCallback<React.TouchEventHandler>(
      event => {
        if (allowResize === true) {
          unFocus(document, window);

          const position =
            split === 'vertical'
              ? event.touches[0].clientX
              : event.touches[0].clientY;

          setState(prevState => ({
            ...prevState,
            active: true,
            position,
          }));
        }
      },
      [allowResize, document, split, window]
    );

    const onMouseDown = useCallback<React.MouseEventHandler>(
      event => {
        const eventWithTouches: any = {
          ...event,
          touches: [{ clientX: event.clientX, clientY: event.clientY }],
        };

        onTouchStart(eventWithTouches);
      },
      [onTouchStart]
    );

    const onTouchMove = useCallback<React.TouchEventHandler>(
      event => {
        if (allowResize && state.active && document && window) {
          unFocus(document, window);
          if (pane1.current && pane2.current) {
            const node1 = pane1.current;
            const node2 = pane2.current;

            if (node1.getBoundingClientRect && state.position !== undefined) {
              const width = node1.getBoundingClientRect().width;
              const height = node1.getBoundingClientRect().height;

              const current =
                split === 'vertical'
                  ? event.touches[0].clientX
                  : event.touches[0].clientY;

              const size = split === 'vertical' ? width : height;

              let positionDelta = state.position - current;

              if (step) {
                if (Math.abs(positionDelta) < step) {
                  return;
                }
                positionDelta = ~~(positionDelta / step) * step;
              }

              let sizeDelta = positionDelta;

              const pane1Order = parseInt(
                `${window.getComputedStyle(node1).order}`,
                10
              );
              const pane2Order = parseInt(
                `${window.getComputedStyle(node2).order}`,
                10
              );

              if (pane1Order > pane2Order) {
                sizeDelta = -sizeDelta;
              }

              let newMaxSize: number | string = maxSize!;

              if (maxSize !== undefined && maxSize <= 0) {
                const pane = splitPane.current;

                if (!pane) {
                  return;
                }

                newMaxSize =
                  split === 'vertical'
                    ? pane.getBoundingClientRect().width + +maxSize
                    : pane.getBoundingClientRect().height + +maxSize;
              }

              let newSize = size - sizeDelta;
              const newPosition = state.position - positionDelta;

              if (newSize < minSize) {
                newSize = +minSize;
              } else if (maxSize !== undefined && newSize > newMaxSize) {
                newSize = +newMaxSize;
              } else {
                setState(prevState => ({
                  ...prevState,
                  position: newPosition,
                  resized: true,
                }));
              }

              if (onChange) {
                onChange(newSize);
              }

              setState(prevState => ({
                ...prevState,
                draggedSize: newSize,
                pane1Size: newSize,
              }));
            }
          }
        }
      },
      [
        allowResize,
        state.active,
        state.position,
        document,
        window,
        split,
        step,
        maxSize,
        minSize,
        onChange,
      ]
    );

    const onMouseMove = useCallback<React.MouseEventHandler>(
      event => {
        const eventWithTouches: any = {
          ...event,
          touches: [{ clientX: event.clientX, clientY: event.clientY }],
        };

        onTouchMove(eventWithTouches);
      },
      [onTouchMove]
    );

    const onMouseUp = useCallback<React.MouseEventHandler>(() => {
      if (allowResize && state.active) {
        setState(prevState => ({
          ...prevState,
          active: false,
        }));
      }
    }, [setState, state, allowResize]);

    const disabledClass = allowResize ? '' : 'disabled';

    useEffect(() => {
      if (document) {
        document.addEventListener('mouseup', onMouseUp as any);
        document.addEventListener('mousemove', onMouseMove as any);
        document.addEventListener('touchmove', onTouchMove as any);
      }

      return () => {
        if (document) {
          document.removeEventListener('mouseup', onMouseUp as any);
          document.removeEventListener('mousemove', onMouseMove as any);
          document.removeEventListener('touchmove', onTouchMove as any);
        }
      };
    }, [splitPane, onMouseUp, onMouseMove, onTouchMove, document]);

    useLayoutEffect(() => {
      setState(prevState => {
        return {
          ...prevState,
          ...getSizeUpdate({ size, defaultSize, minSize, maxSize }, prevState),
        };
      });
    }, [setState, size, defaultSize, minSize, maxSize]);

    const classes = [
      'SplitPane',
      restOfProps.className,
      split,
      disabledClass,
    ].join(' ');

    const notNullChildren = removeNullChildren(restOfProps.children);
    const StyleComponent = split === 'vertical' ? RowStyle : ColumnStyle;

    return (
      <StyleComponent className={classes} ref={splitPane}>
        <Pane order={1} ref={pane1} size={state.pane1Size} split={split}>
          {notNullChildren[0]}
        </Pane>
        <Resizer
          className={disabledClass}
          onClick={onResizerClick}
          onDoubleClick={onResizerDoubleClick}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          onTouchEnd={(onMouseUp as unknown) as React.TouchEventHandler}
          split={split}
        />
        <Pane order={2} ref={pane2} size={state.pane2Size} split={split}>
          {notNullChildren[1]}
        </Pane>
      </StyleComponent>
    );
  }
);
