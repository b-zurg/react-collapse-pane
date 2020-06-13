import styled, { css } from 'styled-components';
import { Fade, Grow, Zoom } from '@material-ui/core';
import { TransitionType } from '.';
import { CollapseOptions } from './index';

type OrientationProps = {
  isVertical: boolean;
};
export const topBottomCss = css`
  top: 0;
  bottom: 0;
`;
const leftRightCss = css`
  right: 0;
  left: 0;
`;

export const ButtonWrapper = styled.div<OrientationProps>`
  cursor: pointer;
  position: absolute;
`;

type ButtonContainerProps = OrientationProps & { grabberSize: string };
export const ButtonContainer = styled.div<ButtonContainerProps>`
  position: absolute;
  ${props => (props.isVertical ? topBottomCss : leftRightCss)}
  ${props => (props.isVertical ? 'width: 6rem' : 'height: 6rem')};
  transform: ${props =>
    props.isVertical
      ? `translateX(-50%) translateX(calc(${props.grabberSize} / 2))`
      : `translateY(-50%) translateY(calc(${props.grabberSize} / 2))`};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ResizeGrabber = styled.div<OrientationProps>`
  position: absolute;
  z-index: 3;
  transform: ${props => (props.isVertical ? 'translateX(-50%)' : 'translateY(-50%)')};
  cursor: ${props => (props.isVertical ? 'col-resize' : 'row-resize')};
  ${props => (props.isVertical ? topBottomCss : leftRightCss)}
`;

export const ResizePresentation = styled.div<{ isVertical: boolean }>`
  z-index: 2;
  position: absolute;
  ${props => (props.isVertical ? topBottomCss : leftRightCss)}
`;

type TransitionComponent = typeof Fade | typeof Grow | typeof Zoom;
const transitionComponentMap: {
  [key in TransitionType]: TransitionComponent;
} = {
  fade: Fade,
  grow: Grow,
  zoom: Zoom,
};

export const getTransition = (details: CollapseOptions | undefined): TransitionComponent =>
  transitionComponentMap[details?.transition ?? 'fade'];

export const getSizeWithUnit = (size: string | number): string =>
  isNaN(size as number) ? size.toString() : `${size}px`;
