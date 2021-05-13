import styled from 'styled-components';
import { SplitPane } from '../src';
import { storiesOf } from '@storybook/react';
import { action, configureActions } from '@storybook/addon-actions';
import React from 'react';
// @ts-ignore
import logo from '../docs/icon.svg';

configureActions({
  depth: 5,
  limit: 5,
});

const Logo = styled.img`
  @keyframes App-logo-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  height: 40vmin;
  pointer-events: none;
  animation: App-logo-spin infinite 20s linear;
`;
const Header = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  text-align: center;
`;
const Link = styled.a`
  color: #61dafb;
  padding-top: 2rem;
`;

storiesOf('Collapsable Panes', module)
  .add('Vertical Split', () => {
    const buttonPositionOffset = 0;
    const collapseDirection = 'left';
    const minSizes = [50, 50, 50, 50];
    const collapseTransition = 500;
    const grabberSize = 10;
    const buttonTransition = 'grow';

    return (
      <Header>
        <SplitPane
          split="vertical"
          collapse={{
            collapseTransitionTimeout: collapseTransition,
            buttonTransition,
            collapseDirection,
            buttonPositionOffset,
          }}
          minSizes={minSizes}
          resizerOptions={{
            grabberSize,
          }}
          hooks={{
            onCollapse: action(`collapsedSizes`),
            onDragStarted: action('onDragStarted'),
            onSaveSizes: action('onDragFinished'),
          }}
        >
          <Logo src={logo} className="App-logo" alt="logo" />
          <p>You can collapse and resize these panes!</p>
          <Link href="https://collapse-pane.zurg.dev" target="_blank" rel="noopener noreferrer">
            <p>Check out the Docs</p>
          </Link>
        </SplitPane>
      </Header>
    );
  })
  .add('Horizontal Split', () => {
    const collapseDirection = 'up';
    const resizerCss = {
      height: '1px',
      background: 'rgba(0, 0, 0, 0.1)',
    };
    const resizerHoverCss = {
      height: '10px',
      marginTop: '-10px',
      backgroundImage:
        'radial-gradient(at center center,rgba(0,0,0,0.2) 0%,transparent 70%,transparent 100%)',
      backgroundSize: '100% 50px',
      backgroundPosition: '50% 0',
      backgroundRepeat: 'no-repeat',
      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    };
    const minSizes = [50, 50, 50, 50];
    return (
      <SplitPane
        split="horizontal"
        initialSizes={[340.75, 816.75, 273.75, 251.75]}
        minSizes={minSizes}
        collapse={{
          collapseDirection,
        }}
        resizerOptions={{
          css: resizerCss,
          hoverCss: resizerHoverCss,
          grabberSize: '1rem',
        }}
        hooks={{
          onCollapse: action(`collapsedSizes`),
          onDragStarted: action('onDragStarted'),
          onSaveSizes: action('onDragFinished'),
        }}
      >
        <div>This is a div</div>
        <div>This is a second div</div>
        <div>This is a third div</div>
        <div>This is a fourth div</div>
      </SplitPane>
    );
  });
