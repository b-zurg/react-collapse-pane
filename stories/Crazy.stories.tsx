import { SplitPane, SplitPaneProps } from '../src';
import { storiesOf } from '@storybook/react';
import { configureActions } from '@storybook/addon-actions';
import React from 'react';

configureActions({
  depth: 5,
  limit: 5,
});
storiesOf('Crazy Combo!', module).add('Do the Splits!', () => {
  const shouldCollapse = true;
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
});
