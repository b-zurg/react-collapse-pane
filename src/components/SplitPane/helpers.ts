import React from 'react';
import styled, { css } from 'styled-components';
import { SplitType } from '.';
import { CollapseOptions } from '../Resizer';

export const DEFAULT_MIN_SIZE = 50;

export const getNodeKey = (index: number): string => {
  return 'index.' + index;
};

export const getMinSize = (index: number, minSizes?: number | number[]): number => {
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
};

export const getDefaultSize = ({
  index,
  defaultSizes,
}: {
  index: number;
  defaultSizes?: number[];
}): number => {
  if (defaultSizes) {
    const value = defaultSizes[index];
    if (value >= 0) {
      return value;
    }
  }
  return 1;
};

export const getRefSize = ({
  ref,
  split,
}: {
  split: SplitType;
  ref: React.RefObject<HTMLDivElement>;
}) => {
  const sizeAttr = split === 'vertical' ? 'width' : 'height';
  return ref.current?.getBoundingClientRect()[sizeAttr] ?? 0;
};
export type MoveDetails = {
  sizes: number[];
  index: number;
  offset: number;
  minSizes: number[];
};

/**
 * Mutates the original array in a recursive fashion, identifying the current sizes, whether they need to be changed, and whether they need to push the next or previous pane.
 */
export const moveSizes = ({ index, minSizes, offset, sizes }: MoveDetails): number => {
  //recursion break points
  if (!offset || index < 0 || index + 1 >= sizes.length) {
    return 0;
  }

  const firstMinSize = getMinSize(index, minSizes);
  const secondMinSize = getMinSize(index + 1, minSizes);
  const firstSize = sizes[index] + offset;
  const secondSize = sizes[index + 1] - offset;

  if (offset < 0 && firstSize < firstMinSize) {
    const missing = firstSize - firstMinSize;
    const pushedOffset = moveSizes({ sizes, index: index - 1, offset: missing, minSizes });

    offset -= missing - pushedOffset;
  } else if (offset > 0 && secondSize < secondMinSize) {
    const missing = secondMinSize - secondSize;
    const pushedOffset = moveSizes({ sizes, index: index + 1, offset: missing, minSizes });

    offset -= missing - pushedOffset;
  }
  sizes[index] += offset;
  sizes[index + 1] -= offset;

  return offset;
};

export const isCollapseDirectionReversed = (
  collapseOptions: CollapseOptions | undefined
): boolean =>
  collapseOptions?.collapseDirection
    ? ['right', 'up'].includes(collapseOptions.collapseDirection)
    : false;

const verticalCss = css`
  left: 0;
  right: 0;
  flex-direction: row;
`;
const horizontalCss = css`
  bottom: 0;
  top: 0;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
`;

export const Wrapper = styled.div<{ split: SplitType }>`
  display: flex;
  flex: 1;
  height: 100%;
  position: absolute;
  outline: none;
  overflow: hidden;
  ${props => (props.split === 'vertical' ? verticalCss : horizontalCss)}
`;
