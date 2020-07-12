import { useMemo } from 'react';
import { SplitPaneProps } from '../../index';

export function useCollapsedSizes({
  collapsedSizes,
  children,
  collapse,
}: Pick<SplitPaneProps, 'collapsedSizes' | 'children' | 'collapse'>) {
  return useMemo(
    () =>
      collapsedSizes?.length === children.length && !!collapse
        ? collapsedSizes
        : new Array(children.length).fill(null),
    [children.length, collapse, collapsedSizes]
  );
}
