import { useMemo } from 'react';
import { Direction, SplitType } from '../../index';

export function useIsLtr({ split, direction }: { direction?: Direction; split: SplitType }) {
  return useMemo(() => !(direction === 'rtl' && split === 'vertical'), [split, direction]);
}
