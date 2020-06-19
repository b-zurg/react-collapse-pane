import { useMemo } from 'react';
import { Direction, SplitType } from '../../index';

export function useIsLtr({ split, direction }: { direction?: Direction; split: SplitType }) {
  return useMemo(() => (split === 'vertical' ? direction !== 'rtl' : true), [split, direction]);
}
