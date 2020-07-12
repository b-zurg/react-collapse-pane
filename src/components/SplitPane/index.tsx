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
import { useCollapseOptions } from './hooks/memos/useCollapseOptions';

// String Unions
export type SplitType = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';
export type TransitionType = 'fade' | 'grow' | 'zoom' | 'none';
export type CollapseDirection = 'left' | 'right' | 'up' | 'down';

export type SplitPaneHooks = {
  onDragStarted?: () => void;
  onChange?: (sizes: number[]) => void;
  onSaveSizes?: (sizes: number[]) => void;
  onCollapse?: (collapsedSizes: Nullable<number>[]) => void;
};
export interface CollapseOptions {
  beforeToggleButton: React.ReactElement;
  afterToggleButton: React.ReactElement;
  buttonTransition: TransitionType;
  buttonTransitionTimeout: number;
  buttonPositionOffset: number;
  collapseDirection: CollapseDirection;
  collapseTransitionTimeout: number;
  collapsedSize: number;
  overlayCss: React.CSSProperties;
}
export interface ResizerOptions {
  css?: React.CSSProperties;
  hoverCss?: React.CSSProperties;
  grabberSize?: number | string;
}

export interface SplitPaneProps {
  split: SplitType;
  collapse?: boolean | Partial<CollapseOptions>;

  dir?: Direction;
  className?: string;

  initialSizes?: number[];
  minSizes?: number | number[];
  collapsedSizes?: Nullable<number>[];

  hooks?: SplitPaneHooks;
  resizerOptions?: ResizerOptions;

  children: React.ReactChild[];
}

export const SplitPane: React.FC<SplitPaneProps> = props => {
  const collapsedSizes = useCollapsedSizes(props);
  const isLtr = useIsLtr(props);
  const isVertical = props.split === 'vertical';
  const isReversed = useIsCollapseReversed(props.collapse);

  const collapseOptions = useCollapseOptions({
    isVertical,
    isLtr,
    originalValue: props.collapse,
    isReversed,
  });

  const [collapsedIndices, setCollapsed] = useState<number[]>(
    convertCollapseSizesToIndices(collapsedSizes)
  );

  const { childPanes, handleDragStart, resizingIndex } = useSplitPaneResize({
    ...props,
    isLtr,
    isVertical,
    collapsedIndices,
    collapsedSizes,
    collapseOptions,
  });

  const splitPaneClass = useMergeClasses(['SplitPane', props.split, props.className]);
  const resizingClass = useMergeClasses(['Resizing', props.className]);

  const toggleCollapse = useToggleCollapse({ setCollapsed, collapsedIndices });
  const getIsPaneCollapsed = useGetIsPaneCollapsed({ collapsedIndices });

  if (childPanes.length <= 1) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[react-collapse-pane] - You must have more than one non-null child inside the SplitPane component.  Even though SplitPane does not crash, you should resolve this error.'
      );
    }
    return <>{props.children}</>;
  }

  // stacks the children and places a resizer in between each of them. Each resizer has the same index as the pane that it controls.
  const entries = childPanes.map((pane, paneIndex) => {
    const resizerPaneIndex = isReversed ? paneIndex : paneIndex - 1;
    return (
      <React.Fragment key={paneIndex}>
        {paneIndex - 1 >= 0 ? (
          <Resizer
            key={`resizer.${resizerPaneIndex}`}
            isCollapsed={getIsPaneCollapsed(resizerPaneIndex)}
            isVertical={isVertical}
            isLtr={isLtr}
            split={props.split}
            className={resizingIndex === resizerPaneIndex ? resizingClass : props.className}
            paneIndex={resizerPaneIndex}
            resizerOptions={props.resizerOptions}
            collapseOptions={collapseOptions}
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
          isVertical={isVertical}
          minSize={getMinSize(paneIndex, props.minSizes)}
          className={props.className}
          transitionTimeout={collapseOptions?.collapseTransitionTimeout}
          collapseOverlayCss={collapseOptions?.overlayCss}
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
