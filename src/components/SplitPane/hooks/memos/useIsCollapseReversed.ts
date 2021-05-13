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

export const useIsCollapseReversed = (collapseOptions?: Partial<CollapseOptions> | boolean) =>
  useMemo(() => isCollapseDirectionReversed(collapseOptions), [collapseOptions]);
