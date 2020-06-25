import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { CollapseOptions, SplitType } from '.';
import { Nullable } from '../../types/utilities';

export const DEFAULT_MIN_SIZE = 50;

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
  collapsedIndices: number[];
  collapsedSize: number;
};

/**
 * Mutates the original array in a recursive fashion, identifying the current sizes, whether they need to be changed, and whether they need to push the next or previous pane.
 */
export const moveSizes = ({
  index,
  minSizes,
  offset,
  sizes,
  collapsedIndices,
  collapsedSize,
}: MoveDetails): number => {
  //recursion break points
  if (!offset || index < 0 || index + 1 >= sizes.length) {
    return 0;
  }
  const isCollapsed = (idx: number) => collapsedIndices.includes(idx);
  const firstMinSize = isCollapsed(index) ? collapsedSize : getMinSize(index, minSizes);
  const secondMinSize = isCollapsed(index + 1) ? collapsedSize : getMinSize(index + 1, minSizes);
  const firstSize = sizes[index] + offset;
  const secondSize = sizes[index + 1] - offset;

  if (offset < 0 && firstSize < firstMinSize) {
    const missing = firstSize - firstMinSize;
    const pushedOffset = moveSizes({
      sizes,
      index: index - 1,
      offset: missing,
      minSizes,
      collapsedIndices,
      collapsedSize,
    });

    offset -= missing - pushedOffset;
  } else if (offset > 0 && secondSize < secondMinSize) {
    const missing = secondMinSize - secondSize;
    const pushedOffset = moveSizes({
      sizes,
      index: index + 1,
      offset: missing,
      minSizes,
      collapsedIndices,
      collapsedSize,
    });

    offset -= missing - pushedOffset;
  }
  sizes[index] += offset;
  sizes[index + 1] -= offset;

  return offset;
};

export const moveCollapsedSiblings = ({
  offset,
  isReversed,
  collapsedIndices,
  minSizes,
  sizes,
  index,
  collapsedSize,
}: {
  offset: number;
  isReversed: boolean;
  index: number;
  sizes: number[];
  collapsedIndices: number[];
  minSizes: number[];
  collapsedSize: number;
}) => {
  if (isReversed ? offset > 0 : offset < 0) {
    for (
      let i = isReversed ? index : index + 1;
      isReversed ? i > 0 : i < sizes.length - 1;
      isReversed ? i-- : i++
    ) {
      if (collapsedIndices.includes(i)) {
        moveSizes({
          sizes,
          index: isReversed ? i - 1 : i,
          offset,
          minSizes,
          collapsedIndices,
          collapsedSize,
        });
      }
    }
  }
};

export const isCollapseDirectionReversed = (
  collapseOptions: CollapseOptions | undefined
): boolean =>
  collapseOptions?.collapseDirection
    ? ['right', 'down'].includes(collapseOptions.collapseDirection)
    : false;

/**
 * Infers the indices of the collapsed panels from an array of nullable collapse sizes.  If the index is null then it's not collapsed.
 */
export const convertCollapseSizesToIndices = (sizes?: Nullable<number>[]) =>
  sizes?.reduce((prev, cur, idx) => (cur !== null ? [...prev, idx] : [...prev]), [] as number[]) ??
  [];

export const addArray = (arr: number[]) => arr.reduce((prev, cur) => prev + cur, 0);

export const debounce = (callback: (...args: any[]) => void, wait = 250) => {
  let timer: any;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), wait);
  };
};

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
