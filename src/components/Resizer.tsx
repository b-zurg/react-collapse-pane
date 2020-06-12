import React, { useState, useCallback } from 'react';
import styled, { css } from 'styled-components';
import { Fade, Grow, Zoom } from '@material-ui/core';
import { ClientPosition } from 'components/hooks/useDragStateHandlers';

type OrientationProps = {
  isVertical: boolean;
};

const ButtonWrapper = styled.div<OrientationProps>`
  cursor: pointer;
  z-index: 3;
`;

const ButtonContainer = styled.div<OrientationProps & { grabberSize: string }>`
  ${props =>
    props.isVertical
      ? css`
          width: 6rem;
          height: 100%;
        `
      : css`
          height: 6rem;
          width: 100%;
        `}
        transform: ${props =>
          props.isVertical
            ? `translateX(-50%) translateX(calc(${props.grabberSize} / 2))`
            : `translateY(-50%) translateY(calc(${props.grabberSize} / 2))`}; 
  display: flex;
  align-items: center;
  justify-content: center;
`;

const topBottomCss = css`
  top: 0;
  bottom: 0;
`;
const leftRightCss = css`
  right: 0;
  left: 0;
`;

const ResizeGrabber = styled.div<OrientationProps>`
  position: absolute;
  ${props => (props.isVertical ? topBottomCss : leftRightCss)}
  z-index: 3;
  transform: ${props =>
    props.isVertical ? 'translateX(-50%)' : 'translateY(-50%)'};
  cursor: ${props => (props.isVertical ? 'col-resize' : 'row-resize')};
`;

const ResizePresentation = styled.div<{ isVertical: boolean }>`
  z-index: 2;
  position: absolute;
  ${props => (props.isVertical ? topBottomCss : leftRightCss)}
`;

type TransitionType = 'fade' | 'grow' | 'zoom';
const transitionComponentMap: {
  [key in TransitionType]: typeof Fade | typeof Grow | typeof Zoom;
} = {
  fade: Fade,
  grow: Grow,
  zoom: Zoom,
};
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
  }: ResizerProps) => {
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
      console.log('button clicked');
    }, []);
    const handleButtonMousedown = useCallback((event: React.MouseEvent) => {
      event.stopPropagation();
    }, []);

    const classes = ['Resizer', split, className].join(' ');
    const [isHovered, setIsHovered] = useState(false);

    const isVertical = split === 'vertical';

    const widthOrHeightSize = (size: string | number) =>
      isVertical ? { width: size } : { height: size };

    const Transition =
      transitionComponentMap[collapseButtonDetails?.transition ?? 'fade'];
    const button = collapseButtonDetails ? (
      <ButtonContainer
        isVertical={isVertical}
        grabberSize={
          isNaN(grabberSize as number)
            ? grabberSize.toString()
            : `${grabberSize}px`
        }
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

    const handleMouseEnter = () => {
      setIsHovered(true);
    };
    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    return (
      <div style={{ position: 'relative' }}>
        <ResizeGrabber
          isVertical={isVertical}
          style={widthOrHeightSize(grabberSize)}
          role="presentation"
          className={classes}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {button}
        </ResizeGrabber>
        <Fade in={isHovered === false}>
          <ResizePresentation
            isVertical={isVertical}
            style={{ ...widthOrHeightSize(1), ...resizerCss }}
          />
        </Fade>
        <Fade in={isHovered}>
          <ResizePresentation
            isVertical={isVertical}
            style={{ ...widthOrHeightSize(1), ...resizerHoverCss }}
          />
        </Fade>
      </div>
    );
  }
);
Resizer.displayName = 'Resizer';
