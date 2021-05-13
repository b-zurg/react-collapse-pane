import { useMemo } from 'react';
import { DEFAULT_MIN_SIZE, getMinSize } from '../../helpers';
import { CollapseOptions } from '../../index';

/**
 * Returns the current actual minimum size of the panel.  This in some cases means the collapsed size.
 */
export const useMinSizes = ({
  minSizes,
  numSizes,
  collapsedIndices,
  collapseOptions,
}: {
  numSizes: number;
  minSizes?: number | number[];
  collapsedIndices: number[];
  collapseOptions?: CollapseOptions;
}): number[] =>
  useMemo(
    () =>
      Array.from({ length: numSizes }).map((_child, idx) =>
        collapsedIndices.includes(idx)
          ? collapseOptions?.collapsedSize ?? DEFAULT_MIN_SIZE
          : getMinSize(idx, minSizes)
      ),
    [numSizes, collapseOptions, collapsedIndices, minSizes]
  );
