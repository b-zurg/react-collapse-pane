import styled from '@emotion/styled';
import { css } from '@emotion/core';

type OrientationProps = {
  $isVertical: boolean;
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

interface ButtonContainerProps extends OrientationProps {
  $grabberSize: string | null;
  $isLtr: boolean;
}
export const ButtonContainer = styled.div<ButtonContainerProps>`
  z-index: 3;
  position: absolute;
  overflow: initial;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${props => `${props.$isVertical ? 'width' : 'height'}: ${props.$grabberSize}`};
  ${props => (props.$isVertical ? topBottomCss : leftRightCss)}
`;

interface GrabberProps extends OrientationProps {
  $isCollapsed: boolean;
}
export const ResizeGrabber = styled.div<GrabberProps>`
  position: absolute;
  z-index: 3;
  transform: ${props => (props.$isVertical ? 'translateX(-50%)' : 'translateY(-50%)')};
  cursor: ${props => !props.$isCollapsed && (props.$isVertical ? 'col-resize' : 'row-resize')};
  ${props => (props.$isVertical ? topBottomCss : leftRightCss)}
`;

export const ResizePresentation = styled.div<OrientationProps>`
  z-index: 2;
  position: absolute;
  ${props => (props.$isVertical ? topBottomCss : leftRightCss)}
`;

export const getSizeWithUnit = (size: string | number): string =>
  isNaN(size as number) ? size.toString() : `${size}px`;
