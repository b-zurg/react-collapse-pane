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
    const shouldCollapse = boolean('Collapsable?', true);
    const VerticalSplitPane = (props: Omit<SplitPaneProps, 'split'>) => (
      <SplitPane split={'vertical'} collapse={shouldCollapse}>
        {props.children}
      </SplitPane>
    );
    const HorizontalSplitpane = (props: Omit<SplitPaneProps, 'split'>) => (
      <SplitPane split={'horizontal'} collapse={shouldCollapse}>
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
