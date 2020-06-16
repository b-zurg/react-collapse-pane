import React, { useCallback } from 'react';
import { useCollapseSize } from './useCollapseSize';
import { useUncollapseSize } from './useUncollapseSize';

export function useUpdateCollapsedSizes({
  movedSizes,
  setCollapsedSizes,
  collapsedSizes,
  collapseSize,
  sizes,
  unCollapseSize,
}: {
  movedSizes: number[];
  collapsedSizes: Nullable<number>[];
  sizes: number[];
  collapseSize: ReturnType<typeof useCollapseSize>;
  unCollapseSize: ReturnType<typeof useUncollapseSize>;
  setCollapsedSizes: React.Dispatch<React.SetStateAction<Nullable<number>[]>>;
}) {
  return useCallback(
    (indices: number[]) => {
      setCollapsedSizes(
        collapsedSizes.map((size, idx) => {
          const isCollapsed = indices.includes(idx);
          if (isCollapsed && size === null) {
            collapseSize({ size: sizes[idx], idx });
            return movedSizes[idx]; // when collapsed store current size
          }
          if (!isCollapsed && size !== null) {
            unCollapseSize({ idx, size }); // when un-collapsed clear size
            return null;
          }
          return size;
        })
      );
    },
    [collapseSize, collapsedSizes, movedSizes, setCollapsedSizes, sizes, unCollapseSize]
  );
}
