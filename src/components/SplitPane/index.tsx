import React, { useCallback, useMemo, useState } from 'react';
import { Pane } from '../Pane';
import { CollapseOptions, Resizer, ResizerOptions } from '../Resizer';
import { useSplitPaneResize } from '../../hooks/useSplitPaneResize';
import { isCollapseDirectionReversed, mergeClasses, Wrapper } from './helpers';

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

export const SplitPane = ({ className = '', ...props }: SplitPaneProps) => {
  const [collapsedIndices, setCollapsed] = useState<number[]>([]);
  const direction = props.direction || 'ltr';
  const { childPanes, resizeState, handleDragStart } = useSplitPaneResize({
    ...props,
    direction,
    collapsedIndices,
  });
  const classes = useMemo(() => mergeClasses(['SplitPane', props.split, className]), [
    props.split,
    className,
  ]);

  const toggleCollapse = useCallback(
    (index: number) => {
      collapsedIndices.includes(index)
        ? setCollapsed(collapsedIndices.filter(i => i !== index))
        : setCollapsed([...collapsedIndices, index]);
    },
    [collapsedIndices]
  );
  const isCollapseReversed = useMemo(() => isCollapseDirectionReversed(props.collapseOptions), [
    props.collapseOptions,
  ]);

  const entries: React.ReactNode[] = childPanes.map((pane, index) => {
    const resizerIndex = index - 1;
    const paneIndex = isCollapseReversed ? index - 1 : index;
    const isCollapsed = (idx: number) =>
      collapsedIndices.length > 0 ? collapsedIndices.includes(idx) : false;
    const resizerClass =
      resizeState?.index === resizerIndex ? mergeClasses([className, 'resizing']) : className;
    const resizer = (
      <Resizer
        key={`resizer.${index}`}
        isCollapsed={isCollapsed(resizerIndex)}
        split={props.split}
        direction={direction}
        className={resizerClass}
        index={resizerIndex}
        resizerOptions={props.resizerOptions}
        collapseOptions={props.collapseOptions}
        onDragStarted={handleDragStart}
        onCollapseToggle={toggleCollapse}
      />
    );
    return (
      <>
        {resizerIndex >= 0 ? resizer : null}
        <Pane
          key={`pane.${pane.key}`}
          forwardRef={pane.ref}
          size={pane.size}
          collapsedSize={props.collapseOptions?.collapseSize ?? 0}
          isCollapsed={isCollapsed(paneIndex)}
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
    <Wrapper className={classes} split={props.split}>
      {entries}
    </Wrapper>
  );
};
SplitPane.displayName = 'SplitPane';
