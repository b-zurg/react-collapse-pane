import React, { useCallback } from 'react';

export const useToggleCollapse = ({
  collapsedIndices,
  setCollapsed,
}: {
  collapsedIndices: number[];
  setCollapsed: React.Dispatch<React.SetStateAction<number[]>>;
}) =>
  useCallback(
    (index: number) => {
      collapsedIndices.includes(index)
        ? setCollapsed(collapsedIndices.filter(i => i !== index))
        : setCollapsed([...collapsedIndices, index]);
    },
    [collapsedIndices, setCollapsed]
  );
