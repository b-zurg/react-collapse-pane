import { useCallback } from 'react';
import { getRefSize } from '../../helpers';
import { ChildPane } from '../useSplitPaneResize';
import { SplitType } from '../..';

export const useGetCurrentPaneSizes = ({
  childPanes,
  split,
}: {
  childPanes: Pick<ChildPane, 'ref'>[];
  split: SplitType;
}) =>
  useCallback(() => childPanes.map(({ ref }): number => getRefSize({ split, ref })), [
    childPanes,
    split,
  ]);
