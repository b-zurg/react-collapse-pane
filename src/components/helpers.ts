import React from 'react';
import { SplitPaneState, SplitPaneProps } from 'components/SplitPane';
import { PaneRef } from 'components/Pane';

export const removeNullChildren = (children: React.ReactNode) => {
  return React.Children.toArray(children).filter(child => child !== null);
};

export const unFocus = (document: Document | null, window: Window | null) => {
  if (document && (document as any).selection) {
    (document as any).selection.empty();
  } else {
    try {
      window && window.getSelection()!.removeAllRanges();
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
};

export type Size = React.CSSProperties['width'] | React.CSSProperties['height'];

export const getDocument = (
  ref: React.MutableRefObject<PaneRef>
): Document | null => ref.current?.ownerDocument ?? null;

export const getWindow = (document: Document | null): Window | null => {
  if (document) {
    // IE = parentWindow === window if no parent | all other browsers
    return (document as any).parentWindow || document.defaultView;
  }
  return null;
};

export const getDefaultSize = (
  defaultSize: Size,
  minSize: Size,
  maxSize: Size,
  draggedSize: Size
) => {
  if (typeof draggedSize === 'number') {
    const min = typeof minSize === 'number' ? minSize : 0;
    const max =
      typeof maxSize === 'number' && maxSize >= 0 ? maxSize : Infinity;

    return Math.max(min, Math.min(max, draggedSize));
  }

  if (defaultSize !== undefined) {
    return defaultSize;
  }

  return minSize;
};

type GetSizeUpdateProps = Pick<
  SplitPaneProps,
  'size' | 'defaultSize' | 'minSize' | 'maxSize'
>;
export const getSizeUpdate = (
  props: GetSizeUpdateProps,
  state: SplitPaneState
): Partial<SplitPaneState> => {
  const newState: Partial<SplitPaneState> = {};

  const { instanceProps } = state;

  if (instanceProps.size === props.size && props.size !== undefined) {
    return {};
  }

  const newSize =
    props.size !== undefined
      ? props.size
      : getDefaultSize(
          props.defaultSize,
          props.minSize,
          props.maxSize,
          state.draggedSize
        );

  if (props.size !== undefined) {
    newState.draggedSize = newSize !== undefined ? +newSize : undefined;
  }

  newState.pane1Size = newSize;
  newState.pane2Size = undefined;

  newState.instanceProps = { size: props.size };

  return newState;
};

// returns something like 'width10pxpadding10px'
// this is kinda safe to do since CSSproperties are one level deep
export const stringifyStyle = (style?: React.CSSProperties): string => {
  if (!style) {
    return '';
  }

  return Object.entries(style)
    .flatMap(s => `${s[0]}${s[1]}`)
    .join('');
};
