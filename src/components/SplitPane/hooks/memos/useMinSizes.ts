import { useMemo } from 'react';
import { DEFAULT_MIN_SIZE, getMinSize } from '../../helpers';
import { CollapseOptions } from '../../index';

/**
 * Returns the current actual minimum size of the panel.  This in some cases means the collapsed size.
 */
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
          ? collapseOptions?.collapsedSize ?? DEFAULT_MIN_SIZE
          : getMinSize(idx, minSizes)
      ),
    [children, collapseOptions, collapsedIndices, minSizes]
  );
}
