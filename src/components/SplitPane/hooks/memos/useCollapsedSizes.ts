import { useMemo } from 'react';
import { SplitPaneProps } from '../../index';

export const useCollapsedSizes = ({
  collapsedSizes,
  children,
  collapse,
}: Pick<SplitPaneProps, 'collapsedSizes' | 'children' | 'collapse'>) =>
  useMemo(
    () =>
      collapsedSizes?.length === children.length && !!collapse
        ? collapsedSizes
        : new Array(children.length).fill(null),
    [children.length, collapse, collapsedSizes]
  );
