import React, { useCallback, useMemo, useState } from 'react';
import { Pane } from '../Pane';
import { CollapseOptions, Resizer, ResizerOptions } from '../Resizer';
import { useSplitPaneResize } from './hooks/useSplitPaneResize';
import { isCollapseDirectionReversed, Wrapper } from './helpers';
import { useMergeClasses } from '../../hooks/useMergeClasses';

export type SplitType = 'horizontal' | 'vertical';
export type Direction = 'ltr' | 'rtl';

export type SplitPaneHooks = {
  onDragStarted?: () => void;
  onChange?: (sizes: number[]) => void;
  onDragFinished?: (sizes: number[]) => void;
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
  const [collapsedIndices, setCollapsed] = useState<number[]>([]);
  const { childPanes, resizeState, handleDragStart } = useSplitPaneResize({
    ...props,
    direction,
    collapsedIndices,
  });

  const splitPaneClass = useMergeClasses(['SplitPane', props.split, className]);
  const resizingClass = useMergeClasses(['resizing', className]);

  const toggleCollapse = useCallback(
    (index: number) => {
      collapsedIndices.includes(index)
        ? setCollapsed(collapsedIndices.filter(i => i !== index))
        : setCollapsed([...collapsedIndices, index]);
    },
    [collapsedIndices]
  );
  const isPaneCollapsed = useCallback(
    (paneIndex: number) =>
      collapsedIndices.length > 0 ? collapsedIndices.includes(paneIndex) : false,
    [collapsedIndices]
  );
  const isCollapseReversed = useMemo(() => isCollapseDirectionReversed(props.collapseOptions), [
    props.collapseOptions,
  ]);

  // stacks the children and places a resizer in between each of them. Each resizer has the same index as the pane that it controls.
  const entries = childPanes.map((pane, paneIndex) => {
    const resizerPaneIndex = isCollapseReversed ? paneIndex : paneIndex - 1;
    return (
      <>
        {paneIndex - 1 >= 0 ? (
          <Resizer
            key={`resizer.${resizerPaneIndex}`}
            isCollapsed={isPaneCollapsed(resizerPaneIndex)}
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
          isCollapsed={isPaneCollapsed(paneIndex)}
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
