import React, { useState } from 'react';
import { Pane } from '../Pane';
import { CollapseOptions, Resizer, ResizerOptions } from '../Resizer';
import { useSplitPaneResize } from './hooks/useSplitPaneResize';
import { convertCollapseSizesToIndices, Wrapper } from './helpers';
import { useMergeClasses } from '../../hooks/useMergeClasses';
import { useIsCollapseReversed } from './hooks/memos/useIsCollapseReversed';
import { useToggleCollapse } from './hooks/callbacks/useToggleCollapse';
import { useGetIsPaneCollapsed } from './hooks/callbacks/useGetIsCollapsed';
import { useIsLtr } from './hooks/memos/useIsLtr';
import { useCollapsedSizes } from './hooks/memos/useCollapsedSizes';

export type SplitType = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';

export type SplitPaneHooks = {
  onDragStarted?: () => void;
  onChange?: (sizes: number[]) => void;
  onSaveSizes?: (sizes: number[]) => void;
  onCollapse?: (collapsedSizes: Nullable<number>[]) => void;
};

export interface SplitPaneProps {
  split: SplitType;
  direction?: Direction;
  className?: string;

  initialSizes?: number[];
  minSizes?: number | number[];
  collapsedSizes?: Nullable<number>[];

  hooks?: SplitPaneHooks;

  collapseOptions?: CollapseOptions;
  resizerOptions?: Partial<ResizerOptions>;

  children: React.ReactChild[];
}

export const SplitPane = ({ className = '', direction = 'ltr', ...props }: SplitPaneProps) => {
  const collapsedSizes = useCollapsedSizes(props);
  const [collapsedIndices, setCollapsed] = useState<number[]>(
    convertCollapseSizesToIndices(collapsedSizes)
  );
  const isLtr = useIsLtr({ split: props.split, direction });

  const { childPanes, handleDragStart, resizeState } = useSplitPaneResize({
    ...props,
    isLtr,
    collapsedIndices,
    collapsedSizes,
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
            isLtr={isLtr}
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
          collapsedIndices={collapsedIndices}
          split={props.split}
          className={className}
          transitionTimeout={props.collapseOptions?.collapseTransitionTimeout}
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
