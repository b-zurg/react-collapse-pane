import * as React from 'react';
import { SplitType } from '../SplitPane';
import { useMergeClasses } from '../../hooks/useMergeClasses';
import { useEffect, useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';

const DEFAULT_COLLAPSE_TRANSITION_TIMEOUT = 500;
const verticalCss = css`
  width: 0;
  height: 100%;
`;
const horizontalCss = css`
  width: 100%;
  height: 0;
`;
const coverCss = css`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;

interface PaneRootProps {
  $isVertical: boolean;
  $shouldAnimate: boolean;
  $timeout: number;
}
const PaneRoot = styled.div<PaneRootProps>`
  position: relative;
  outline: none;
  border: 0;
  overflow: hidden;
  display: flex;
  flex-grow: 1;
  flex-shrink: 1;
  ${props => (props.$isVertical ? verticalCss : horizontalCss)}
  ${props => props.$shouldAnimate && `transition: flex-basis ${props.$timeout}ms ease-in-out`}
`;
const WidthPreserver = styled.div<{ $isCollapsed: boolean }>`
  ${coverCss}
  ${props =>
    props.$isCollapsed &&
    css`
      * {
        z-index: 0;
      }
      z-index: 0;
    `}
`;

const CollapseOverlay = styled.div<{ $timeout: number; $isCollapsed: boolean }>`
  ${props => props.$isCollapsed && coverCss}
  ${props =>
    props.$isCollapsed &&
    css`
      z-index: 1;
    `};
  opacity: ${props => (props.$isCollapsed ? 1 : 0)};
  transition: opacity ${props => props.$timeout}ms ease-in-out;
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
  const [shouldAnimate, setShouldAnimate] = useState(false);

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
  const widthPreserverStyle: React.CSSProperties = isCollapsed
    ? { ...minStyle, userSelect: 'none' }
    : minStyle;
  return (
    <PaneRoot
      $isVertical={split === 'vertical'}
      $shouldAnimate={timeout !== 0 && shouldAnimate}
      $timeout={timeout}
      className={classes}
      ref={forwardRef}
      style={{ flexBasis: size }}
    >
      <CollapseOverlay $isCollapsed={isCollapsed} $timeout={timeout} style={collapseOverlayCss} />
      <WidthPreserver $isCollapsed={isCollapsed} style={widthPreserverStyle}>
        {children}
      </WidthPreserver>
    </PaneRoot>
  );
};

UnMemoizedPane.displayName = 'Pane';
export const Pane = React.memo(UnMemoizedPane);
