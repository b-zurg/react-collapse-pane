import React, { useState } from 'react';
import { Pane } from '../Pane';
import { CollapseOptions, Resizer, ResizerOptions } from '../Resizer';
import { useSplitPaneResize } from './hooks/useSplitPaneResize';
import { convertCollapseSizesToIndices, Wrapper } from './helpers';
import { useMergeClasses } from '../../hooks/useMergeClasses';
import { useIsCollapseReversed } from './hooks/memos/useIsCollapseReversed';
import { useToggleCollapse } from './hooks/callbacks/useToggleCollapse';
import { useGetIsPaneCollapsed } from './hooks/callbacks/useGetIsCollapsed';

export type SplitType = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';

export type SplitPaneHooks = {
  onDragStarted?: () => void;
  onChange?: (sizes: number[]) => void;
  onDragFinished?: (sizes: number[]) => void;
  onCollapse?: (collapsedSizes: Nullable<number>[]) => void;
};

export interface SplitPaneProps {
  split: SplitType;
  direction?: Direction;
  defaultSizes?: number[];
  minSizes?: number | number[];
  className?: string;

  collapseOptions?: CollapseOptions;
  resizerOptions?: Partial<ResizerOptions>;
  hooks?: SplitPaneHooks;
  children: React.ReactChild[];
}

export const SplitPane = ({ className = '', direction = 'ltr', ...props }: SplitPaneProps) => {
  const [collapsedIndices, setCollapsed] = useState<number[]>(
    convertCollapseSizesToIndices(props.collapseOptions?.collapsedSizes)
  );
  const { childPanes, resizeState, handleDragStart } = useSplitPaneResize({
    ...props,
    direction,
    collapsedIndices,
  });

  const splitPaneClass = useMergeClasses(['SplitPane', props.split, className]);
  const resizingClass = useMergeClasses(['resizing', className]);

  const toggleCollapse = useToggleCollapse({ setCollapsed, collapsedIndices });
  const getIsPaneCollapsed = useGetIsPaneCollapsed({ collapsedIndices });
  const isCollapseReversed = useIsCollapseReversed(props.collapseOptions);

  // stacks the children and places a resizer in between each of them. Each resizer has the same index as the pane that it controls.
  const entries = childPanes.map((pane, paneIndex) => {
    const resizerPaneIndex = isCollapseReversed ? paneIndex : paneIndex - 1;
    return (
      <>
        {paneIndex - 1 >= 0 ? (
          <Resizer
            key={`resizer.${resizerPaneIndex}`}
            isCollapsed={getIsPaneCollapsed(resizerPaneIndex)}
            split={props.split}
            direction={direction}
            className={resizeState?.index === resizerPaneIndex ? resizingClass : className}
            paneIndex={resizerPaneIndex}
            resizerOptions={props.resizerOptions}
            collapseOptions={props.collapseOptions}
            onDragStarted={handleDragStart}
            onCollapseToggle={toggleCollapse}
          />
        ) : null}
        <Pane
          key={`pane.${paneIndex}`}
          forwardRef={pane.ref}
          size={pane.size}
          isCollapsed={getIsPaneCollapsed(paneIndex)}
          minSize={pane.minSize}
          split={props.split}
          className={className}
          collapseOverlayCss={props.collapseOptions?.overlayCss}
        >
          {pane.node}
        </Pane>
      </>
    );
  });

  return (
    <Wrapper className={splitPaneClass} split={props.split}>
      {entries}
    </Wrapper>
  );
};
SplitPane.displayName = 'SplitPane';
