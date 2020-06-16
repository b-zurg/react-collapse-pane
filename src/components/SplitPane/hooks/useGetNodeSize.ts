import { useCallback } from 'react';
import * as React from 'react';
import { getDefaultSize, getNodeKey } from '../helpers';

/**
 *  Provides a function that will give the size of specific react node, used to get the size of a child.
 * @param sizes
 * @param defaultSizes
 */
export function useGetNodeSize({
  sizes,
  defaultSizes,
}: {
  defaultSizes?: number[];
  sizes: Map<string, number>;
}) {
  return useCallback(
    (node: React.ReactChild, index: number): number =>
      sizes.get(getNodeKey(node, index)) || getDefaultSize({ index, defaultSizes }),
    [defaultSizes, sizes]
  );
}
