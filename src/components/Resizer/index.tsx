import React, { useState, useCallback, useMemo } from 'react';
import { Fade } from '@material-ui/core';
import { ClientPosition } from '../hooks/useDragStateHandlers';
import { getTransition, getSizeWithUnit } from '../Resizer/helpers';
import { mergeClasses } from '../SplitPane/helpers';
import {
  ButtonContainer,
  ButtonWrapper,
  ResizeGrabber,
  ResizePresentation,
} from './helpers';

export type TransitionType = 'fade' | 'grow' | 'zoom';

export interface ResizerCollapseButtonProps {
  button?: React.ReactElement;
  transition?: TransitionType;
  timeout?: number;
}

export interface ResizerProps {
  split: 'horizontal' | 'vertical';
  className: string;
  index: number;
  collapseButtonDetails?: ResizerCollapseButtonProps;
  resizerCss?: React.CSSProperties;
  resizerHoverCss?: React.CSSProperties;
  grabberSize?: string | number;
  onDragStarted: (index: number, pos: ClientPosition) => void;
  onCollapseToggle: () => void;
}

export const Resizer = React.memo(
  ({
    split,
    className,
    index,
    onDragStarted,
    grabberSize = '1rem',
    resizerCss = { backgroundColor: 'silver' },
    resizerHoverCss = { backgroundColor: 'grey' },
    collapseButtonDetails,
    onCollapseToggle,
  }: ResizerProps) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseDown = useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();
        onDragStarted(index, event);
      },
      [index, onDragStarted]
    );

    const handleTouchStart = useCallback(
      (event: React.TouchEvent) => {
        event.preventDefault();
        onDragStarted(index, event.touches[0]);
      },
      [index, onDragStarted]
    );

    const handleButtonClick = useCallback((event: React.MouseEvent) => {
      event.stopPropagation();
      onCollapseToggle();
    }, []);
    const handleButtonMousedown = useCallback((event: React.MouseEvent) => {
      event.stopPropagation();
    }, []);

    const classes = useMemo(() => mergeClasses(['Resizer', split, className]), [
      split,
      className,
    ]);

    const isVertical = split === 'vertical';

    const getWidthOrHeight = (size: string | number) =>
      isVertical ? { width: size } : { height: size };
    const grabberSizeWithUnit = useMemo(() => getSizeWithUnit(grabberSize), [
      grabberSize,
    ]);

    const Transition = useMemo(() => getTransition(collapseButtonDetails), [
      collapseButtonDetails,
    ]);

    const collapseButton = collapseButtonDetails ? (
      <ButtonContainer
        isVertical={isVertical}
        grabberSize={grabberSizeWithUnit}
      >
        <Transition in={isHovered} timeout={collapseButtonDetails.timeout}>
          <ButtonWrapper
            isVertical={isVertical}
            onClick={handleButtonClick}
            onMouseDown={handleButtonMousedown}
          >
            {collapseButtonDetails.button}
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
        <Fade in={isHovered === false}>
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
  }
);
Resizer.displayName = 'Resizer';
