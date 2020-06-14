import React from 'react';
import { SplitPane, SplitPaneProps } from '../src';
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

const collapseLtrOptions: SplitPaneProps['collapseOptions'] = {
  beforeToggleButton: <Button>⬅</Button>,
  afterToggleButton: <Button>➡</Button>,
  collapseSize: 40,
};
const collapseRtlOptions: SplitPaneProps['collapseOptions'] = {
  beforeToggleButton: <Button>➡</Button>,
  afterToggleButton: <Button>⬅</Button>,
  overlayCss: { backgroundColor: 'rgb(0, 0, 0, 0.4)' },
  timeout: 300,
  transition: 'zoom',
  collapseSize: 40,
};

const resizerOptions: SplitPaneProps['resizerOptions'] = {
  css: {
    width: '1px',
    background: 'rgba(0, 0, 0, 0.1)',
  },
  hoverCss: {
    width: '10px',
    marginLeft: '-10px',
    backgroundImage:
      'radial-gradient(at center center,rgba(0,0,0,0.2) 0%,transparent 70%,transparent 100%)',
    backgroundSize: '50px 100%',
    backgroundPosition: '0 50%',
    backgroundRepeat: 'no-repeat',
    borderRight: '1px solid rgba(0, 0, 0, 0.1)',
  },
  grabberSize: '1rem',
};
const RtlDiv = styled.div`
  direction: rtl;
`;

storiesOf('Vertical', module)
  .add('Collapsable, Left to Right', () => (
    <SplitPane
      split="vertical"
      collapseOptions={collapseLtrOptions}
      resizerOptions={resizerOptions}
    >
      <div>This is a div</div>
      <div>This is a second div</div>
      <div>This is a third div</div>
      <div>This is a fourth div</div>
    </SplitPane>
  ))
  .add('Collapsable, Left to Right, Reversed', () => (
    <SplitPane
      split="vertical"
      collapseOptions={{
        ...collapseLtrOptions,
        collapseDirection: 'right',
        beforeToggleButton: <Button>➡</Button>,
        afterToggleButton: <Button>⬅</Button>,
      }}
      resizerOptions={resizerOptions}
    >
      <div>This is a div</div>
      <div>This is a second div</div>
      <div>This is a third div</div>
      <div>This is a fourth div</div>
    </SplitPane>
  ))
  .add('Collapsable, Right to Left', () => (
    <RtlDiv>
      <SplitPane
        split="vertical"
        collapseOptions={collapseRtlOptions}
        direction="rtl"
        resizerOptions={resizerOptions}
      >
        <div>اللوحة الأولى</div>
        <div>الجلسة الثانية</div>
        <div>الجلسة الثالثة</div>
        <div>الجلسة الرابعة</div>
      </SplitPane>
    </RtlDiv>
  ));
export const HorizontalSplitWithDivs = () => (
  <SplitPane split="horizontal">
    <div>This is a div</div>
    <div>This is a second div</div>
  </SplitPane>
);

storiesOf('Horizontal', module).add('with divs', () => <HorizontalSplitWithDivs />);
