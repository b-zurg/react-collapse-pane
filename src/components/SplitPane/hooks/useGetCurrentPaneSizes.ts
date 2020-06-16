import { useCallback } from 'react';
import { getRefSize } from '../helpers';
import { ChildPane } from './useSplitPaneResize';
import { SplitType } from '../index';

export function useGetCurrentPaneSizes({
  childPanes,
  split,
}: {
  childPanes: Pick<ChildPane, 'ref'>[];
  split: SplitType;
}) {
  return useCallback(() => childPanes.map(({ ref }): number => getRefSize({ split, ref })), [
    childPanes,
    split,
  ]);
}
