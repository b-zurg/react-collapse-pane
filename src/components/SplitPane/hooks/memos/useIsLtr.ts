import { useMemo } from 'react';
import { Direction, SplitType } from '../../index';

export function useIsLtr({ split, dir }: { dir?: Direction; split: SplitType }) {
  return useMemo(() => (split === 'vertical' ? dir !== 'rtl' : true), [split, dir]);
}
