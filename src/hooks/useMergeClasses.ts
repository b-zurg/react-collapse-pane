import { useMemo } from 'react';

export function useMergeClasses(classes: string[]): string {
  return useMemo(() => classes.join(' '), [classes]);
}
