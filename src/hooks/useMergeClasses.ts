import { useMemo } from 'react';

export const useMergeClasses = (classes: (string | undefined)[]): string =>
  useMemo(() => classes.filter(c => c).join(' '), [classes]);
