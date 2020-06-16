import * as React from 'react';
import { SplitType } from './SplitPane';
import styled, { css } from 'styled-components';
import { useMergeClasses } from '../hooks/useMergeClasses';

const verticalCss = css`
  width: 0;
  height: 100%;
`;
const horizontalCss = css`
  width: 100%;
  height: 0;
`;
const StyledDiv = styled.div<{ isVertical: boolean }>`
  position: relative;
  outline: none;
  border: 0;
  overflow: hidden;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  ${props => (props.isVertical ? verticalCss : horizontalCss)}
`;
const CollapseOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  user-select: none;
`;
export interface PaneProps {
  size: number;
  minSize: number;

  split: SplitType;
  className: string;
  isCollapsed: boolean;
  forwardRef: React.Ref<HTMLDivElement>;
  collapseOverlayCss?: React.CSSProperties;

  children: React.ReactNode;
}
export const Pane = React.memo(
  ({
    size,
    minSize,
    isCollapsed,
    collapseOverlayCss = { background: 'rgba(0, 0, 0, 0.03)' },
    split,
    className,
    forwardRef,
    children,
  }: PaneProps) => {
    const classes = useMergeClasses(['Pane', split, className]);

    const flexBasis = Math.max(size, minSize);

    return (
      <StyledDiv
        isVertical={split === 'vertical'}
        className={classes}
        ref={forwardRef}
        style={{ flexBasis }}
      >
        {isCollapsed ? (
          <CollapseOverlay style={collapseOverlayCss}>{children}</CollapseOverlay>
        ) : (
          children
        )}
      </StyledDiv>
    );
  }
);
Pane.displayName = 'Pane';
