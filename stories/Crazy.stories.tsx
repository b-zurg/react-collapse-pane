import styled from '@emotion/styled';
import { SplitPane, SplitPaneProps } from '../src/components/SplitPane';
import { storiesOf } from '@storybook/react';
import { configureActions } from '@storybook/addon-actions';
import React from 'react';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';

configureActions({
  depth: 5,
  limit: 5,
});
const Button = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 1000px;
  background: grey;
  cursor: pointer;
  user-select: none;
  text-align: center;
  color: white;
  border: 1px silver solid;
`;

storiesOf('Crazy Combo!', module)
  .add('Do the Splits!', () => {
    const verticalCollapseDirection = select(
      'Vertical Direction',
      { left: 'left', right: 'right' },
      'left'
    );
    const horizontalCollapseDirection = select(
      'Horizontal Direction',
      { up: 'up', down: 'down' },
      'up'
    );
    const shouldCollapse = boolean('Collapsable?', true);
    const verticalCollapseOptions = shouldCollapse
      ? {
          beforeToggleButton: <Button>{verticalCollapseDirection === 'left' ? '⬅' : '➡'}</Button>,
          afterToggleButton: <Button>{verticalCollapseDirection === 'left' ? '➡' : '⬅'}</Button>,
          collapsedSize: 40,
          collapseDirection: verticalCollapseDirection,
        }
      : undefined;
    const horizontalCollapseOptions = shouldCollapse
      ? {
          beforeToggleButton: <Button>{horizontalCollapseDirection === 'up' ? '⬆' : '⬇'}</Button>,
          afterToggleButton: <Button>{horizontalCollapseDirection === 'up' ? '⬇' : '⬆'}</Button>,
          collapsedSize: 40,
          collapseDirection: horizontalCollapseDirection,
        }
      : undefined;
    const VerticalSplitPane = (props: Omit<SplitPaneProps, 'split'>) => (
      <SplitPane split={'vertical'} collapseOptions={verticalCollapseOptions}>
        {props.children}
      </SplitPane>
    );
    const HorizontalSplitpane = (props: Omit<SplitPaneProps, 'split'>) => (
      <SplitPane split={'horizontal'} collapseOptions={horizontalCollapseOptions}>
        {props.children}
      </SplitPane>
    );

    return (
      <HorizontalSplitpane>
        I'm at the top level!
        <VerticalSplitPane>
          <div>This is a div</div>
          <div>This is a second div</div>
          <div>
            <HorizontalSplitpane>
              <div>Horizontal 1</div>
              <VerticalSplitPane>
                <div>I'm within the horizontal but vertical!</div>
                <div>I'm the same but again!</div>
              </VerticalSplitPane>
            </HorizontalSplitpane>
          </div>
          <div>This is a fourth div</div>
        </VerticalSplitPane>
      </HorizontalSplitpane>
    );
  })
  .addDecorator(withKnobs);
