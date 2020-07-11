import { useMemo } from 'react';

export function useMergeClasses(classes: (string | undefined)[]): string {
  return useMemo(() => classes.filter(c => c).join(' '), [classes]);
}
