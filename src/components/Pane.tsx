import * as React from 'react';
import { SplitType } from './SplitPane';
import styled, { css } from 'styled-components';
import { mergeClasses } from './SplitPane/helpers';
import { useMemo } from 'react';

export interface PaneProps {
  size: number;
  minSize: number;

  split: SplitType;
  className: string;
  isCollapsed: boolean;
  collapsedSize: number;
  forwardRef: React.Ref<HTMLDivElement>;
  collapseOverlayCss?: React.CSSProperties;

  children: React.ReactNode;
}

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

export const Pane = React.memo(
  ({
    size,
    minSize,
    collapsedSize,
    isCollapsed,
    collapseOverlayCss = { background: 'rgba(0, 0, 0, 0.03)' },
    split,
    className,
    forwardRef,
    children,
  }: PaneProps) => {
    const classes = useMemo(() => mergeClasses(['Pane', split, className]), [split, className]);

    const isVertical = split === 'vertical';
    const flexBasis = isCollapsed ? collapsedSize : Math.max(size, minSize);
    const maxSizeStyle = isVertical
      ? { maxWidth: collapsedSize, minWidth: collapsedSize }
      : { maxHeight: collapsedSize, minHeight: collapsedSize };

    return (
      <StyledDiv
        isVertical={split === 'vertical'}
        className={classes}
        ref={forwardRef}
        style={{ flexBasis, ...(isCollapsed ? maxSizeStyle : {}) }}
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
