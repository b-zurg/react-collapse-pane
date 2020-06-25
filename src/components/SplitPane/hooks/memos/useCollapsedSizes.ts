import React, { useMemo } from 'react';
import { CollapseOptions } from '../../index';
import { Nullable } from '../../../../types/utilities';

export function useCollapsedSizes({
  collapsedSizes,
  children,
  collapseOptions,
}: {
  children: React.ReactChild[];
  collapsedSizes?: Nullable<number>[];
  collapseOptions?: CollapseOptions;
}) {
  return useMemo(
    () =>
      collapsedSizes?.length === children.length && collapseOptions !== undefined
        ? collapsedSizes
        : new Array(children.length).fill(null),
    [children.length, collapseOptions, collapsedSizes]
  );
}
