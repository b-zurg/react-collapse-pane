import { useMemo } from 'react';
import { DEFAULT_MIN_SIZE, getMinSize } from '../../helpers';
import { CollapseOptions } from '../../../Resizer';

export function useMinSizes({
  minSizes,
  children,
  collapsedIndices,
  collapseOptions,
}: {
  children: unknown[];
  minSizes?: number | number[];
  collapsedIndices: number[];
  collapseOptions?: CollapseOptions;
}): number[] {
  return useMemo(
    () =>
      children.map((_child, idx) =>
        collapsedIndices.includes(idx)
          ? collapseOptions?.collapseSize ?? DEFAULT_MIN_SIZE
          : getMinSize(idx, minSizes)
      ),
    [children, minSizes]
  );
}
