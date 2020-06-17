import { CollapseOptions } from '../../../Resizer';
import { useMemo } from 'react';
export const DEFAULT_COLLAPSE_SIZE = 50;

export function useCollapsedSize({ collapseOptions }: { collapseOptions?: CollapseOptions }) {
  return useMemo(() => collapseOptions?.collapsedSize ?? DEFAULT_COLLAPSE_SIZE, [collapseOptions]);
}
