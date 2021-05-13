import React, { useCallback } from 'react';
import { moveCollapsedSiblings, moveSizes } from '../../helpers';
import * as ReactDOM from 'react-dom';

export const useCollapseSize = ({
  isReversed,
  movedSizes,
  minSizes,
  collapsedIndices,
  setSizes,
  setMovedSizes,
  collapsedSize,
}: {
  isReversed: boolean;
  movedSizes: number[];
  minSizes: number[];
  collapsedIndices: number[];
  setSizes: React.Dispatch<React.SetStateAction<number[]>>;
  setMovedSizes: React.Dispatch<React.SetStateAction<number[]>>;
  collapsedSize: number;
}) =>
  useCallback(
    ({ size, idx }: { idx: number; size: number }) => {
      const offset = isReversed ? -(collapsedSize - size) : collapsedSize - size;
      const index = isReversed ? idx - 1 : idx;
      const sizes = [...movedSizes];
      moveSizes({ sizes, index, offset, minSizes, collapsedIndices, collapsedSize });
      moveCollapsedSiblings({
        offset,
        index,
        isReversed,
        collapsedIndices,
        minSizes,
        sizes,
        collapsedSize,
      });
      ReactDOM.unstable_batchedUpdates(() => {
        setMovedSizes(sizes);
        setSizes(sizes);
      });
    },
    [isReversed, collapsedSize, movedSizes, minSizes, collapsedIndices, setMovedSizes, setSizes]
  );
