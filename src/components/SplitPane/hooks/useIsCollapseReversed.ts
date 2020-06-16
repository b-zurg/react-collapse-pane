import { useMemo } from 'react';
import { isCollapseDirectionReversed } from '../helpers';
import { CollapseOptions } from '../../Resizer';

export function useIsCollapseReversed(collapseOptions?: CollapseOptions) {
  return useMemo(() => isCollapseDirectionReversed(collapseOptions), [collapseOptions]);
}
