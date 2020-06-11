import React from 'react';
import { Pane, SplitPane } from '../src';
import { storiesOf } from '@storybook/react';
import styled from 'styled-components';

const StyledSplit = styled(SplitPane)`
  .Resizer {
    background: #000;
    opacity: 0.2;
    z-index: 1;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    -moz-background-clip: padding;
    -webkit-background-clip: padding;
    background-clip: padding-box;
  }
  .Resizer:hover {
    -webkit-transition: all 2s ease;
    transition: all 2s ease;
  }
  .Resizer.horizontal {
    height: 11px;
    margin: -5px 0;
    border-top: 5px solid rgba(255, 255, 255, 0);
    border-bottom: 5px solid rgba(255, 255, 255, 0);
    cursor: row-resize;
    width: 100%;
  }
  .Resizer.horizontal:hover {
    border-top: 5px solid rgba(0, 0, 0, 0.5);
    border-bottom: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Resizer.vertical {
    width: 11px;
    margin: 0 -5px;
    border-left: 5px solid rgba(255, 255, 255, 0);
    border-right: 5px solid rgba(255, 255, 255, 0);
    cursor: col-resize;
  }
  .Resizer.vertical:hover {
    border-left: 5px solid rgba(0, 0, 0, 0.5);
    border-right: 5px solid rgba(0, 0, 0, 0.5);
  }
  .Resizer.disabled {
    cursor: not-allowed;
  }
  .Resizer.disabled:hover {
    border-color: transparent;
  }
`;

export const VerticalSplitWithDivs = () => (
  <StyledSplit split="vertical">
    <div>This is a div</div>
    <div>This is a div</div>
  </StyledSplit>
);
export const VerticalSplitWithPanes = () => (
  <StyledSplit split="vertical">
    <Pane>This is a Pane</Pane>
    <Pane>This is a Pane</Pane>
  </StyledSplit>
);

storiesOf('Vertical', module)
  .add('with divs', () => <VerticalSplitWithDivs />)
  .add('with Panes', () => <VerticalSplitWithPanes />);

export const HorizontalSplitWithDivs = () => (
  <StyledSplit split="horizontal">
    <div>This is a div</div>
    <div>This is a div</div>
  </StyledSplit>
);
export const HorizontalSplitWithPanes = () => (
  <StyledSplit split="horizontal">
    <Pane>This is a Pane</Pane>
    <Pane>This is a Pane</Pane>
  </StyledSplit>
);

storiesOf('Horizontal', module)
  .add('with divs', () => <HorizontalSplitWithDivs />)
  .add('with Panes', () => <HorizontalSplitWithPanes />);
