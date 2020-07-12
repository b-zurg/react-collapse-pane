import { useMemo } from 'react';
import { CollapseOptions } from '../../index';

export const isCollapseDirectionReversed = (
  collapseOptions?: Partial<CollapseOptions> | boolean
): boolean => {
  if (typeof collapseOptions === 'boolean') return false;
  return collapseOptions?.collapseDirection
    ? ['right', 'down'].includes(collapseOptions.collapseDirection)
    : false;
};

export function useIsCollapseReversed(collapseOptions?: Partial<CollapseOptions> | boolean) {
  return useMemo(() => isCollapseDirectionReversed(collapseOptions), [collapseOptions]);
}
