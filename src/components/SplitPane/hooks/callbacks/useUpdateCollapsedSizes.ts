import React, { useCallback } from 'react';
import { useCollapseSize } from './useCollapseSize';
import { useUncollapseSize } from './useUncollapseSize';
import { SplitPaneHooks } from '../..';
import { Nullable } from '../../../../types/utilities';

export const useUpdateCollapsedSizes = ({
  movedSizes,
  setCollapsedSizes,
  collapsedSizes,
  collapseSize,
  sizes,
  hooks,
  unCollapseSize,
}: {
  movedSizes: number[];
  collapsedSizes: Nullable<number>[];
  sizes: number[];
  collapseSize: ReturnType<typeof useCollapseSize>;
  unCollapseSize: ReturnType<typeof useUncollapseSize>;
  setCollapsedSizes: React.Dispatch<React.SetStateAction<Nullable<number>[]>>;
  hooks?: SplitPaneHooks;
}) =>
  useCallback(
    (indices: number[]) => {
      setCollapsedSizes(
        collapsedSizes.map((size, idx) => {
          const isCollapsed = indices.includes(idx);
          if (isCollapsed && size === null) {
            collapseSize({ size: sizes[idx], idx });
            hooks?.onChange?.(sizes);
            return movedSizes[idx]; // when collapsed store current size
          }
          if (!isCollapsed && size !== null) {
            unCollapseSize({ idx, size }); // when un-collapsed clear size
            hooks?.onChange?.(sizes);
            return null;
          }
          return size;
        })
      );
    },
    [collapseSize, collapsedSizes, hooks, movedSizes, setCollapsedSizes, sizes, unCollapseSize]
  );
