import styled from '@emotion/styled';
import { SplitPane, SplitPaneProps, SplitPaneProvider, useStoreActions } from '../src';
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

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px silver solid;
  width: 100%;
`;

const Icon = () => (
  <svg
    id="Layer_1"
    enable-background="new 0 0 512 512"
    height="1.5rem"
    viewBox="0 0 512 512"
    width="1rem"
    fill="#fff"
  >
    <path d="m464.883 64.267h-417.766c-25.98 0-47.117 21.136-47.117 47.149 0 25.98 21.137 47.117 47.117 47.117h417.766c25.98 0 47.117-21.137 47.117-47.117 0-26.013-21.137-47.149-47.117-47.149z" />
    <path d="m464.883 208.867h-417.766c-25.98 0-47.117 21.136-47.117 47.149 0 25.98 21.137 47.117 47.117 47.117h417.766c25.98 0 47.117-21.137 47.117-47.117 0-26.013-21.137-47.149-47.117-47.149z" />
    <path d="m464.883 353.467h-417.766c-25.98 0-47.117 21.137-47.117 47.149 0 25.98 21.137 47.117 47.117 47.117h417.766c25.98 0 47.117-21.137 47.117-47.117 0-26.012-21.137-47.149-47.117-47.149z" />
  </svg>
);

storiesOf('Customization', module)
  .add('Use Split Actions', () => {
    const verticalCollapseDirection = select(
      'Vertical Direction',
      { left: 'left', right: 'right' },
      'left'
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

    const VerticalSplitPane = (props: Omit<SplitPaneProps, 'split'>) => (
      <SplitPane split={'vertical'} collapseOptions={verticalCollapseOptions}>
        {props.children}
      </SplitPane>
    );

    const TopHeader = ({ index }: { index: number }) => {
      const toggleCollapse = useStoreActions(action => action.baseStates.toggleCollapse);
      return (
        <HeaderContainer>
          <Button onClick={() => toggleCollapse(index)}>
            <Icon />
          </Button>
          <div>Top menu</div>
          <div />
        </HeaderContainer>
      );
    };

    return (
      <SplitPaneProvider>
        <TopHeader index={0} />

        <VerticalSplitPane>
          <div>This is a div</div>
          <div>This is a second div</div>
        </VerticalSplitPane>
      </SplitPaneProvider>
    );
  })
  .addDecorator(withKnobs);
