import React, { useCallback } from 'react';
import * as ReactDOM from 'react-dom';
import { moveSizes } from '../../helpers';

export const useUncollapseSize = ({
  isReversed,
  movedSizes,
  minSizes,
  setMovedSizes,
  setSizes,
  collapsedSize,
  collapsedIndices,
}: {
  isReversed: boolean;
  movedSizes: number[];
  minSizes: number[];
  setSizes: React.Dispatch<React.SetStateAction<number[]>>;
  setMovedSizes: React.Dispatch<React.SetStateAction<number[]>>;
  collapsedSize: number;
  collapsedIndices: number[];
}) =>
  useCallback(
    ({ size, idx }: { size: number; idx: number }) => {
      const offset = isReversed ? -(size - 50) : size - 50;
      const index = isReversed ? idx - 1 : idx;
      const newSizes = [...movedSizes];
      moveSizes({ sizes: newSizes, index, offset, minSizes, collapsedSize, collapsedIndices });
      ReactDOM.unstable_batchedUpdates(() => {
        setMovedSizes(newSizes);
        setSizes(newSizes);
      });
    },
    [collapsedIndices, collapsedSize, isReversed, minSizes, movedSizes, setMovedSizes, setSizes]
  );
