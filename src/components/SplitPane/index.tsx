import React, { useState } from 'react';
import { Pane } from '../Pane';
import { Resizer } from '../Resizer';
import { useSplitPaneResize } from './hooks/useSplitPaneResize';
import { convertCollapseSizesToIndices, getMinSize, Wrapper } from './helpers';
import { useMergeClasses } from '../../hooks/useMergeClasses';
import { useIsCollapseReversed } from './hooks/memos/useIsCollapseReversed';
import { useToggleCollapse } from './hooks/callbacks/useToggleCollapse';
import { useGetIsPaneCollapsed } from './hooks/callbacks/useGetIsCollapsed';
import { useIsLtr } from './hooks/memos/useIsLtr';
import { useCollapsedSizes } from './hooks/memos/useCollapsedSizes';
import { Nullable } from '../../types/utilities';

export type SplitType = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';

export type SplitPaneHooks = {
  onDragStarted?: () => void;
  onChange?: (sizes: number[]) => void;
  onSaveSizes?: (sizes: number[]) => void;
  onCollapse?: (collapsedSizes: Nullable<number>[]) => void;
};

export type TransitionType = 'fade' | 'grow' | 'zoom' | 'none';
export type CollapseDirection = 'left' | 'right' | 'up' | 'down';

export interface CollapseOptions {
  beforeToggleButton: React.ReactElement;
  afterToggleButton: React.ReactElement;
  buttonTransition?: TransitionType;
  buttonTransitionTimeout?: number;
  buttonPositionOffset?: number;
  collapseDirection?: CollapseDirection;
  collapseTransitionTimeout?: number;
  collapsedSize?: number;
  overlayCss?: React.CSSProperties;
}

export interface ResizerOptions {
  css?: React.CSSProperties;
  hoverCss?: React.CSSProperties;
  grabberSize?: number | string;
}

export interface SplitPaneProps {
  split: SplitType;
  direction?: Direction;
  className?: string;

  initialSizes?: number[];
  minSizes?: number | number[];
  collapsedSizes?: Nullable<number>[];

  hooks?: SplitPaneHooks;

  collapseOptions?: CollapseOptions;
  resizerOptions?: ResizerOptions;

  children: React.ReactChild[];
}

export const SplitPane = ({ className = '', ...props }: SplitPaneProps) => {
  const collapsedSizes = useCollapsedSizes(props);
  const isLtr = useIsLtr(props);

  const [collapsedIndices, setCollapsed] = useState<number[]>(
    convertCollapseSizesToIndices(collapsedSizes)
  );

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

  if (childPanes.length <= 1) {
    console.error(
      '[react-collapse-pane] - You must have more than one non-null child inside the SplitPane component.  Even though SplitPane does not crash, you should resolve this error.'
    );
    return <>{props.children}</>;
  }

  // stacks the children and places a resizer in between each of them. Each resizer has the same index as the pane that it controls.
  const entries = childPanes.map((pane, paneIndex) => {
    const resizerPaneIndex = isCollapseReversed ? paneIndex : paneIndex - 1;
    return (
      <React.Fragment key={paneIndex}>
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
          minSize={getMinSize(paneIndex, props.minSizes)}
          className={className}
          transitionTimeout={props.collapseOptions?.collapseTransitionTimeout}
          collapseOverlayCss={props.collapseOptions?.overlayCss}
        >
          {pane.node}
        </Pane>
      </React.Fragment>
    );
  });

  return (
    <Wrapper key="splitpanewrapper" className={splitPaneClass} split={props.split}>
      {entries}
    </Wrapper>
  );
};
SplitPane.displayName = 'SplitPane';
SplitPane.key = 'SplitPane';
