import * as React from 'react';
import { SplitType } from './SplitPane';
import styled, { css } from 'styled-components';
import { useMergeClasses } from '../hooks/useMergeClasses';
import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_COLLAPSE_TRANSITION_TIMEOUT = 500;
const verticalCss = css`
  width: 0;
  height: 100%;
`;
const horizontalCss = css`
  width: 100%;
  height: 0;
`;
const StyledDiv = styled.div<{ isVertical: boolean; shouldAnimate: boolean; timeout: number }>`
  position: relative;
  outline: none;
  border: 0;
  overflow: hidden;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  ${props => (props.isVertical ? verticalCss : horizontalCss)}
  ${props => props.shouldAnimate && `transition: flex-basis ${props.timeout}ms ease-in-out`}
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
  collapsedIndices: number[];
  children: React.ReactNode;
  transitionTimeout: number | undefined;
}
const UnMemoizedPane = ({
  size,
  minSize,
  isCollapsed,
  collapseOverlayCss = { background: 'rgba(220,220,220, 0.1)' },
  split,
  className,
  children,
  forwardRef,
  collapsedIndices,
  transitionTimeout,
}: PaneProps) => {
  const classes = useMergeClasses(['Pane', split, className]);
  const timeout = useMemo(() => transitionTimeout ?? DEFAULT_COLLAPSE_TRANSITION_TIMEOUT, [
    transitionTimeout,
  ]);
  const [shouldAnimate, setShouldAnimate] = useState<boolean>(false);

  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) {
      if (timeout !== 0) {
        setShouldAnimate(true);
        setTimeout(() => setShouldAnimate(false), 500);
      }
    } else {
      didMount.current = true;
    }
  }, [setShouldAnimate, collapsedIndices, timeout]);

  const minStyle = useMemo(
    () => (split === 'vertical' ? { minWidth: minSize } : { minHeight: minSize }),
    [minSize, split]
  );
  const collapseOverlayStyle = isCollapsed ? { ...collapseOverlayCss, ...minStyle } : minStyle;
  return (
    <StyledDiv
      isVertical={split === 'vertical'}
      className={classes}
      ref={forwardRef}
      style={{ flexBasis: size }}
      shouldAnimate={timeout !== 0 && shouldAnimate}
      timeout={timeout}
    >
      <CollapseOverlay style={collapseOverlayStyle}>{children}</CollapseOverlay>
    </StyledDiv>
  );
};

UnMemoizedPane.displayName = 'Pane';
export const Pane = React.memo(UnMemoizedPane);
