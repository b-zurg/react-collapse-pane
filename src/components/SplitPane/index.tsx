import React, { useCallback, useMemo, useState } from 'react';

import { Pane } from '../Pane';
import { Resizer, CollapseOptions } from '../Resizer';
import { useSplitPaneResize } from '../hooks/useSplitPaneResize';
import { mergeClasses, Wrapper } from './helpers';

export type SplitType = 'horizontal' | 'vertical';

export interface SplitPaneProps {
  split?: SplitType;
  className?: string;
  children: React.ReactChild[];

  collapseOptions?: CollapseOptions;
  resizerCss?: React.CSSProperties;
  resizerHoverCss?: React.CSSProperties;
  grabberSize?: number | string;

  defaultSizes?: number[];
  minSize?: number | number[];

  onDragStarted?: () => void;
  onChange?: (sizes: number[]) => void;
  onDragFinished?: (sizes: number[]) => void;
}

const defaultProps = {
  split: 'vertical' as const,
  className: '',
};

export const SplitPane = (props: SplitPaneProps) => {
  const options = { ...defaultProps, ...props };
  const { split, className } = options;

  const [collapsedIndices, setCollapsed] = useState<number[]>([]);
  const { childPanes, resizeState, handleDragStart } = useSplitPaneResize({
    ...options,
    collapsedIndices,
  });

  const classes = useMemo(() => mergeClasses(['SplitPane', split, className]), [split, className]);

  const onCollapse = useCallback(
    (index: number) => {
      const isCollapsed = collapsedIndices.includes(index);
      isCollapsed
        ? setCollapsed(collapsedIndices.filter(i => i !== index))
        : setCollapsed([...collapsedIndices, index]);
    },
    [collapsedIndices]
  );

  const entries: React.ReactNode[] = childPanes.map((pane, index) => {
    const resizerIndex = index - 1;
    const isCollapsed = (idx: number) =>
      collapsedIndices.length > 0 ? collapsedIndices.includes(idx) : false;
    const resizerClass =
      resizeState?.index === resizerIndex ? mergeClasses([className, 'resizing']) : className;
    const resizer = (
      <Resizer
        key={`resizer.${index}`}
        split={split}
        className={resizerClass}
        index={resizerIndex}
        grabberSize={props.grabberSize}
        resizerCss={props.resizerCss}
        resizerHoverCss={props.resizerHoverCss}
        collapseOptions={props.collapseOptions}
        onDragStarted={handleDragStart}
        isCollapsed={isCollapsed(resizerIndex)}
        onCollapseToggle={onCollapse}
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
          isCollapsed={isCollapsed(index)}
          minSize={pane.minSize}
          split={split}
          className={className}
        >
          {pane.node}
        </Pane>
      </>
    );
  });

  return (
    <Wrapper className={classes} split={split}>
      {entries}
    </Wrapper>
  );
};
SplitPane.displayName = 'SplitPane';
