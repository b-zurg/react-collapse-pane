import { useCallback } from 'react';
import { useStoreState } from '../../../../store/hooks';

export function useGetIsPaneCollapsed(/*{ collapsedIndices }: { collapsedIndices: number[] }*/) {
  const collapsedIndices = useStoreState(state => state.baseStates.collapsedIndices);
  return useCallback(
    (paneIndex: number) =>
      collapsedIndices.length > 0 ? collapsedIndices.includes(paneIndex) : false,
    [collapsedIndices]
  );
}
