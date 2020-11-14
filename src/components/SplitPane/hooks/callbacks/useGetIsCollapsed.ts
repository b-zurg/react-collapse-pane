import { useCallback } from 'react';

export function useGetIsPaneCollapsed({ collapsedIndices }: { collapsedIndices: number[] }) {
  return useCallback(
    (paneIndex: number) =>
      collapsedIndices.length > 0 ? collapsedIndices.includes(paneIndex) : false,
    [collapsedIndices]
  );
}
