import React from 'react';
import { SplitPane } from '../src';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

export const VerticalSplitWithDivs = () => (
  <SplitPane split="vertical">
    <div>This is a div</div>
    <div>This is a div</div>
  </SplitPane>
);

const Button = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 1000px;
  background: grey;
  cursor: pointer;
  user-select: none;
  text-align: center;
  color: lightskyblue;
  border: 1px silver solid;
`;
export const VerticalSplitWithButton = () => (
  <SplitPane
    split="vertical"
    collapseOptions={{
      beforeToggleButton: <Button>⬅</Button>,
      afterToggleButton: <Button>➡</Button>,
      transition: 'fade',
      timeout: 200,
      collapseSize: 40,
    }}
    resizerCss={{
      width: '1px',
      background: 'rgba(0, 0, 0, 0.1)',
    }}
    resizerHoverCss={{
      width: '10px',
      marginLeft: '-10px',
      backgroundImage:
        'radial-gradient(at center center,rgba(0,0,0,0.2) 0%,transparent 70%,transparent 100%)',
      backgroundSize: '50px 100%',
      backgroundPosition: '0 50%',
      backgroundRepeat: 'no-repeat',
      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    }}
    grabberSize="1rem"
  >
    <div>This is a div</div>
    <div>This is a second div</div>
    <div>This is a third div</div>
    <div>This is a fourth div</div>
  </SplitPane>
);

storiesOf('Vertical', module).add('With Button and Shadows', () => <VerticalSplitWithButton />);

export const HorizontalSplitWithDivs = () => (
  <SplitPane split="horizontal">
    <div>This is a div</div>
    <div>This is a div</div>
  </SplitPane>
);

storiesOf('Horizontal', module).add('with divs', () => <HorizontalSplitWithDivs />);
