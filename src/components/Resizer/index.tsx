import React, { useCallback, useMemo, useState } from 'react';
import { Fade } from '@material-ui/core';
import { ClientPosition } from '../hooks/useDragStateHandlers';
import { getSizeWithUnit, getTransition } from './helpers';
import { mergeClasses } from '../SplitPane/helpers';
import { ButtonContainer, ButtonWrapper, ResizeGrabber, ResizePresentation } from './helpers';
import { Direction } from '../SplitPane';

export type TransitionType = 'fade' | 'grow' | 'zoom';

export interface CollapseOptions {
  beforeToggleButton: React.ReactElement;
  afterToggleButton: React.ReactElement;
  transition?: TransitionType;
  timeout?: number;
  collapseSize: number;
  overlayCss?: React.CSSProperties;
}
export interface ResizerOptions {
  css: React.CSSProperties;
  hoverCss: React.CSSProperties;
  grabberSize: number | string;
}
const defaultResizerOptions: ResizerOptions = {
  grabberSize: '1rem',
  css: { backgroundColor: 'silver' },
  hoverCss: { backgroundColor: 'grey' },
};

export interface ResizerProps {
  split: 'horizontal' | 'vertical';
  direction: Direction;
  className: string;
  index: number;
  collapseOptions?: CollapseOptions;
  resizerOptions?: Partial<ResizerOptions>;
  onDragStarted: (index: number, pos: ClientPosition) => void;
  onCollapseToggle: (index: number) => void;
  isCollapsed: boolean;
}
export const Resizer = ({
  split,
  className,
  index,
  onDragStarted,
  resizerOptions,
  collapseOptions,
  onCollapseToggle,
  direction,
  isCollapsed,
}: ResizerProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { grabberSize, css, hoverCss } = { ...defaultResizerOptions, ...resizerOptions };
  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!isCollapsed) {
        onDragStarted(index, event);
      }
    },
    [index, isCollapsed, onDragStarted]
  );

  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();
      if (!isCollapsed) {
        onDragStarted(index, event.touches[0]);
      }
    },
    [index, isCollapsed, onDragStarted]
  );

  const handleButtonClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onCollapseToggle(index);
    },
    [index, onCollapseToggle]
  );
  const handleButtonMousedown = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);

  const getWidthOrHeight = (size: string | number) =>
    isVertical ? { width: size } : { height: size };

  const isVertical = split === 'vertical';
  const classes = useMemo(() => mergeClasses(['Resizer', split, className]), [split, className]);
  const grabberSizeWithUnit = useMemo(() => getSizeWithUnit(grabberSize), [grabberSize]);
  const Transition = useMemo(() => getTransition(collapseOptions), [collapseOptions]);
  const collapseButton = collapseOptions ? (
    <ButtonContainer
      isVertical={isVertical}
      grabberSize={isCollapsed ? null : grabberSizeWithUnit}
      direction={direction}
    >
      <Transition in={isHovered} timeout={collapseOptions.timeout}>
        <ButtonWrapper
          isVertical={isVertical}
          onClick={handleButtonClick}
          onMouseDown={handleButtonMousedown}
        >
          {isCollapsed ? collapseOptions.afterToggleButton : collapseOptions.beforeToggleButton}
        </ButtonWrapper>
      </Transition>
    </ButtonContainer>
  ) : null;

  const handleMouseEnterGrabber = () => {
    setIsHovered(true);
  };
  const handleMouseLeaveGrabber = () => {
    setIsHovered(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {isCollapsed ? (
        collapseButton
      ) : (
        <ResizeGrabber
          isVertical={isVertical}
          style={getWidthOrHeight(grabberSize)}
          role="presentation"
          className={classes}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseEnter={handleMouseEnterGrabber}
          onMouseLeave={handleMouseLeaveGrabber}
        >
          {collapseButton}
        </ResizeGrabber>
      )}
      <Fade in={!isHovered}>
        <ResizePresentation isVertical={isVertical} style={{ ...getWidthOrHeight(1), ...css }} />
      </Fade>
      <Fade in={isHovered}>
        <ResizePresentation
          isVertical={isVertical}
          style={{ ...getWidthOrHeight(1), ...hoverCss }}
        />
      </Fade>
    </div>
  );
};
Resizer.displayName = 'Resizer';
