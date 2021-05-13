import { SplitPane, SplitPaneProps } from '../src';
import { storiesOf } from '@storybook/react';
import { configureActions } from '@storybook/addon-actions';
import React from 'react';

configureActions({
  depth: 5,
  limit: 5,
});
storiesOf('Initial States', module)
  .add('Ltr, First Pane Collapsed', () => {
    const shouldCollapse = true;
    const VerticalSplitPane = (props: Omit<SplitPaneProps, 'split'>) => (
      <SplitPane split={'vertical'} collapse={shouldCollapse} {...props}>
        {props.children}
      </SplitPane>
    );

    return (
      <VerticalSplitPane collapsedSizes={[200, null, null]}>
        <div>This is a div</div>
        <div>This is a second div</div>
        <div>This is a third div</div>
      </VerticalSplitPane>
    );
  })
  .add('Ltr, First Two Panes Collapsed', () => {
    const shouldCollapse = true;
    const VerticalSplitPane = (props: Omit<SplitPaneProps, 'split'>) => (
      <SplitPane split={'vertical'} collapse={shouldCollapse} {...props}>
        {props.children}
      </SplitPane>
    );

    return (
      <VerticalSplitPane collapsedSizes={[200, 200, null]}>
        <div>This is a div</div>
        <div>This is a second div</div>
        <div>This is a third div</div>
      </VerticalSplitPane>
    );
  })
  .add('Initial Sizes as Flex-Basis proportions', () => {
    return (
      <SplitPane split="vertical" initialSizes={[1, 2, 1]}>
        <div>This is a div</div>
        <div>This is a second div</div>
        <div>This is a third div</div>
      </SplitPane>
    );
  })
  .add('Only one child skips splitpane layout', () => {
    return (
      //@ts-ignore
      <SplitPane split="vertical" initialSizes={[1, 2, 1]}>
        <div>This is only one div!</div>
      </SplitPane>
    );
  });
