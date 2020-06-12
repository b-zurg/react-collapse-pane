import * as React from 'react';

import { Pane } from '../Pane';
import { Resizer, ResizerCollapseButtonProps } from '../Resizer';
import { useSplitPaneResize } from '../hooks/useSplitPaneResize';
import styled, { css } from 'styled-components';
import { mergeClasses } from './helpers';

export type SplitType = 'horizontal' | 'vertical';

export interface SplitPaneProps {
  split?: SplitType;
  className?: string;
  children: React.ReactChild[];

  collapseButtonDetails?: ResizerCollapseButtonProps;
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

const verticalCss = css`
  left: 0;
  right: 0;
  flex-direction: row;
`;
const horizontalCss = css`
  bottom: 0;
  top: 0;
  flex-direction: column;
  min-height: 100%;
  width: 100%;
`;

const Wrapper = styled.div<{ split: SplitType }>`
  display: flex;
  flex: 1;
  height: 100%;
  position: absolute;
  outline: none;
  overflow: hidden;
  ${props => (props.split === 'vertical' ? verticalCss : horizontalCss)}
`;

const DragLayer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const SplitPane = React.memo((props: SplitPaneProps) => {
  const options = { ...defaultProps, ...props };
  const { split, className } = options;

  const { childPanes, resizeState, handleDragStart } = useSplitPaneResize(
    options
  );

  const classes = mergeClasses(['SplitPane', split, className]);
  const dragLayerClasses = mergeClasses([
    'DragLayer',
    split,
    resizeState ? 'resizing' : '',
    className,
  ]);

  const entries: React.ReactNode[] = [];

  childPanes.forEach(({ key, node, ref, size, minSize }, index) => {
    if (index !== 0) {
      const resizing = resizeState && resizeState.index === index - 1;
      entries.push(
        <Resizer
          key={`resizer.${index}`}
          split={split}
          className={`${className}${resizing ? ' resizing' : ''}`}
          index={index - 1}
          grabberSize={props.grabberSize}
          resizerCss={props.resizerCss}
          resizerHoverCss={props.resizerHoverCss}
          collapseButtonDetails={props.collapseButtonDetails}
          onDragStarted={handleDragStart}
        />
      );
    }

    entries.push(
      <Pane
        key={`pane.${key}`}
        forwardRef={ref}
        size={size}
        minSize={minSize}
        split={split}
        className={className}
      >
        {node}
      </Pane>
    );
  });

  return (
    <Wrapper className={classes} split={split}>
      <DragLayer className={dragLayerClasses} />
      {entries}
    </Wrapper>
  );
});
SplitPane.displayName = 'SplitPane';
