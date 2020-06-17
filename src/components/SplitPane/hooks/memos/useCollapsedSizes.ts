import React, { useMemo } from 'react';

export function useCollapsedSizes({
  collapsedSizes,
  children,
}: {
  children: React.ReactChild[];
  collapsedSizes?: Nullable<number>[];
}) {
  return useMemo(
    () =>
      collapsedSizes?.length === children.length
        ? collapsedSizes
        : new Array(children.length).fill(null),
    [children, collapsedSizes]
  );
}
