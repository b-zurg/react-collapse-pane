import { useMemo } from 'react';
import { isCollapseDirectionReversed } from '../../helpers';
import { CollapseOptions } from '../../index';

export function useIsCollapseReversed(collapseOptions?: CollapseOptions) {
  return useMemo(() => isCollapseDirectionReversed(collapseOptions), [collapseOptions]);
}
