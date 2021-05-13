import { useCallback } from 'react';

export const useGetIsPaneCollapsed = ({ collapsedIndices }: { collapsedIndices: number[] }) =>
  useCallback(
    (paneIndex: number) =>
      collapsedIndices.length > 0 ? collapsedIndices.includes(paneIndex) : false,
    [collapsedIndices]
  );
