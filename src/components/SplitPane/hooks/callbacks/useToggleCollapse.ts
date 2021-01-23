import React, { useCallback } from 'react';

export function useToggleCollapse({
  collapsedIndices,
  setCollapsed,
}: {
  collapsedIndices: number[];
  setCollapsed: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  return useCallback(
    (index: number) => {
      collapsedIndices.includes(index)
        ? setCollapsed(collapsedIndices.filter(i => i !== index))
        : setCollapsed([...collapsedIndices, index]);
    },
    [collapsedIndices, setCollapsed]
  );
}
