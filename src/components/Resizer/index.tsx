import React, { useState, useCallback, useMemo } from 'react';
import { Fade } from '@material-ui/core';
import { ClientPosition } from '../hooks/useDragStateHandlers';
import { getTransition, getSizeWithUnit } from '../Resizer/helpers';
import { mergeClasses } from '../SplitPane/helpers';
import { ButtonContainer, ButtonWrapper, ResizeGrabber, ResizePresentation } from './helpers';

export type TransitionType = 'fade' | 'grow' | 'zoom';

export interface CollapseOptions {
  beforeToggleButton: React.ReactElement;
  afterToggleButton: React.ReactElement;
  transition?: TransitionType;
  timeout?: number;
  collapseSize: number;
}

export interface ResizerProps {
  split: 'horizontal' | 'vertical';
  className: string;
  index: number;
  collapseOptions?: CollapseOptions;
  resizerCss?: React.CSSProperties;
  resizerHoverCss?: React.CSSProperties;
  grabberSize?: string | number;
  onDragStarted: (index: number, pos: ClientPosition) => void;
  onCollapseToggle: (index: number) => void;
  isCollapsed: boolean;
}

export const Resizer = ({
  split,
  className,
  index,
  onDragStarted,
  grabberSize = '1rem',
  resizerCss = { backgroundColor: 'silver' },
  resizerHoverCss = { backgroundColor: 'grey' },
  collapseOptions,
  onCollapseToggle,
  isCollapsed,
}: ResizerProps) => {
  const [isHovered, setIsHovered] = useState(false);

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
    <ButtonContainer isVertical={isVertical} grabberSize={grabberSizeWithUnit}>
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
      <Fade in={!isHovered}>
        <ResizePresentation
          isVertical={isVertical}
          style={{ ...getWidthOrHeight(1), ...resizerCss }}
        />
      </Fade>
      <Fade in={isHovered}>
        <ResizePresentation
          isVertical={isVertical}
          style={{ ...getWidthOrHeight(1), ...resizerHoverCss }}
        />
      </Fade>
    </div>
  );
};
Resizer.displayName = 'Resizer';
