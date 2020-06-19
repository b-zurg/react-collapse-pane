import styled, { css } from 'styled-components';

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
  grabberSize: string | null;
  isLtr: boolean;
}
export const ButtonContainer = styled.div<ButtonContainerProps>`
  position: absolute;
  ${props => (props.$isVertical ? topBottomCss : leftRightCss)}
  ${props => (props.$isVertical ? 'width: 5rem' : 'height: 5rem')};
  transform: ${props =>
    props.$isVertical
      ? `translateX(${props.isLtr ? '-' : ''}50%) ${
          props.grabberSize ? `translateX(calc(${props.grabberSize} / 2))` : ''
        }`
      : `translateY(${props.isLtr ? '-' : ''}50%) ${
          props.grabberSize ? `translateY(calc(${props.grabberSize} / 2))` : ''
        }`};
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  z-index: 3;
  justify-content: center;
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
