import { useMemo } from 'react';
import * as React from 'react';
import { ChildPane } from '../useSplitPaneResize';

// converts all children nodes into 'childPane' objects that has its ref, key, but not the size yet
export const useChildPanes = ({
  paneRefs,
  children,
  minSizes,
}: {
  paneRefs: React.MutableRefObject<Map<string, React.RefObject<HTMLDivElement>>>;
  children: React.ReactChild[];
  minSizes: number[];
}) => {
  const childPanes: Omit<ChildPane, 'size'>[] = useMemo(() => {
    const prevPaneRefs = paneRefs.current;
    paneRefs.current = new Map<string, React.RefObject<HTMLDivElement>>();
    return children.map((node, index) => {
      const key = `index.${index}`;
      const ref = prevPaneRefs.get(key) || React.createRef();
      paneRefs.current.set(key, ref);
      return { key, node, ref, minSize: minSizes[index] };
    });
  }, [children, minSizes, paneRefs]);
  return childPanes;
};
