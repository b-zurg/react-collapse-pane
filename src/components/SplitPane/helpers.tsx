import React from 'react';
import styled, { css } from 'styled-components';
import { SplitType } from '.';

const DEFAULT_MIN_SIZE = 50;

export const getNodeKey = (node: React.ReactChild, index: number): string => {
  if (typeof node === 'object' && node && node.key != null) {
    return 'key.' + node.key;
  }
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

export const getDefaultSize = (index: number, defaultSizes?: number[]): number => {
  if (defaultSizes) {
    const value = defaultSizes[index];
    if (value >= 0) {
      return value;
    }
  }
  return 1;
};

export const move = (
  sizes: number[],
  index: number,
  offset: number,
  minSizes: number | number[] | undefined
): number => {
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
};

export const mergeClasses = (classes: string[]) => classes.join(' ');

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

export const DragLayer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const PlaceHolder = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 3rem;
  background: grey;
`;
