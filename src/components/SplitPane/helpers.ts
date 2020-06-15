import React from 'react';
import styled, { css } from 'styled-components';
import { SplitType } from '.';
import { CollapseOptions } from '../Resizer';

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

const addFunc = (a: number, b: number) => (a += b);
const subFunc = (a: number, b: number) => (a -= b);

export type MoveDetails = {
  sizes: number[];
  index: number;
  offset: number;
  minSizes: number[];
  isLtr: boolean;
  collapsedIndices: number[];
};

export const moveSizes = (details: MoveDetails) => {
  const { index, offset, sizes: originalSizes, isLtr } = details;
  if (offset === 0) return originalSizes;
  const isCurIdxMoved = (idx: number) => idx === index;
  const isPrevIdxMoved = (idx: number) => idx - 1 === index;

  //arithmetic must be reversed if rtl
  const add = isLtr ? addFunc : subFunc;
  const sub = isLtr ? subFunc : addFunc;

  // originally apply size shift in a naive manner
  const naiveMove = originalSizes.map((size, idx) => {
    if (isCurIdxMoved(idx)) return add(size, offset);
    if (isPrevIdxMoved(idx)) return sub(size, offset);
    return size;
  });

  // ensure the minimum size of each panel is kept
  const applyMinSizes = (sizes: number[]) =>
    sizes.reduce((allPrev, size) => {
      const prevSize = allPrev.pop();
      if (!prevSize) return [size];
      const diff = Math.max(DEFAULT_MIN_SIZE - prevSize, 0);
      return [...allPrev, add(prevSize, diff), sub(size, diff)];
    }, [] as number[]);

  return offset < 0 ? applyMinSizes(naiveMove.reverse()).reverse() : applyMinSizes(naiveMove);
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
