import React, { useCallback, useMemo, useState } from 'react';
import { Fade } from '@material-ui/core';
import { ClientPosition } from '../SplitPane/hooks/effects/useDragState';
import {
  ButtonContainer,
  ButtonWrapper,
  getSizeWithUnit,
  ResizeGrabber,
  ResizePresentation,
} from './helpers';
import { useMergeClasses } from '../../hooks/useMergeClasses';
import { CollapseOptions, ResizerOptions } from '../SplitPane';
import styled from '@emotion/styled';
import { useTransition } from './hooks/useTransition';

const ButtonPositionOffset = styled.div`
  flex: 1 1 auto;
`;

const defaultResizerOptions: Required<ResizerOptions> = {
  grabberSize: '1rem',
  css: { backgroundColor: 'rgba(120, 120, 120, 0.3)' },
  hoverCss: { backgroundColor: 'rgba(120, 120, 120, 0.6)' },
};

export interface ResizerProps {
  split: 'horizontal' | 'vertical';
  isLtr: boolean;
  className: string;
  paneIndex: number;
  collapseOptions?: CollapseOptions;
  resizerOptions?: Partial<ResizerOptions>;
  onDragStarted: (paneIndex: number, pos: ClientPosition) => void;
  onCollapseToggle: (paneIndex: number) => void;
  isCollapsed: boolean;
}
export const Resizer = ({
  split,
  className,
  paneIndex,
  onDragStarted,
  resizerOptions,
  collapseOptions,
  onCollapseToggle,
  isLtr,
  isCollapsed,
}: ResizerProps) => {
  const { grabberSize, css, hoverCss } = { ...defaultResizerOptions, ...resizerOptions };

  const isVertical = split === 'vertical';
  const classes = useMergeClasses(['Resizer', split, className]);
  const grabberSizeWithUnit = useMemo(() => getSizeWithUnit(grabberSize), [grabberSize]);
  const Transition = useTransition(collapseOptions);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      if (!isCollapsed) {
        onDragStarted(paneIndex, event);
      }
    },
    [paneIndex, isCollapsed, onDragStarted]
  );
  const handleTouchStart = useCallback(
    (event: React.TouchEvent) => {
      event.preventDefault();
      if (!isCollapsed) {
        onDragStarted(paneIndex, event.touches[0]);
      }
    },
    [paneIndex, isCollapsed, onDragStarted]
  );
  const handleButtonClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      onCollapseToggle(paneIndex);
    },
    [paneIndex, onCollapseToggle]
  );
  const handleButtonMousedown = useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
  }, []);
  const handleMouseEnterGrabber = useCallback(() => {
    setIsHovered(true);
  }, [setIsHovered]);
  const handleMouseLeaveGrabber = useCallback(() => {
    setIsHovered(false);
  }, [setIsHovered]);

  const getWidthOrHeight = useCallback(
    (size: string | number) => (isVertical ? { width: size } : { height: size }),
    [isVertical]
  );
  const preButtonFlex = useMemo(
    () => Math.max(100 - (collapseOptions?.buttonPositionOffset ?? 0), 0),
    [collapseOptions]
  );
  const postButtonFlex = useMemo(
    () => Math.max(100 + (collapseOptions?.buttonPositionOffset ?? 0), 0),
    [collapseOptions]
  );
  const isTransition = collapseOptions?.buttonTransition !== 'none';
  const collapseButton = collapseOptions ? (
    <ButtonContainer $isVertical={isVertical} grabberSize={grabberSizeWithUnit} isLtr={isLtr}>
      <ButtonPositionOffset style={{ flexBasis: preButtonFlex }} />
      <Transition
        in={isTransition ? isHovered : true}
        timeout={isTransition ? collapseOptions.buttonTransitionTimeout : 0}
        style={{ flex: '0 0 0', position: 'relative' }}
      >
        <ButtonWrapper
          $isVertical={isVertical}
          onClick={handleButtonClick}
          onMouseDown={handleButtonMousedown}
        >
          {isCollapsed ? collapseOptions.afterToggleButton : collapseOptions.beforeToggleButton}
        </ButtonWrapper>
      </Transition>
      <ButtonPositionOffset style={{ flexBasis: postButtonFlex }} />
    </ButtonContainer>
  ) : null;

  return (
    <div key="grabber.root" style={{ position: 'relative' }}>
      <ResizeGrabber
        key="grabber"
        $isVertical={isVertical}
        $isCollapsed={isCollapsed}
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
      <Fade key="resize.presentation.fadein" in={!isHovered}>
        <ResizePresentation $isVertical={isVertical} style={{ ...getWidthOrHeight(1), ...css }} />
      </Fade>
      <Fade key="resize.presentation.fadeout" in={isHovered}>
        <ResizePresentation
          $isVertical={isVertical}
          style={{ ...getWidthOrHeight(1), ...hoverCss }}
        />
      </Fade>
    </div>
  );
};
Resizer.displayName = 'Resizer';
