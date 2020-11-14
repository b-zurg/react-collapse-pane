import styled from '@emotion/styled';
import { SplitPane } from '../src';
import { storiesOf } from '@storybook/react';
import { action, configureActions } from '@storybook/addon-actions';
import React from 'react';
import { select, withKnobs, object, number } from '@storybook/addon-knobs';
// @ts-ignore
import logo from '../docs/icon.svg';

configureActions({
  depth: 5,
  limit: 5,
});
const Button = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 1000px;
  background: grey;
  font-size: 1.1rem;
  cursor: pointer;
  user-select: none;
  text-align: center;
  color: white;
  border: 1px silver solid;
`;
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
    const buttonPositionOffset = number('Button Position Offset', 0, {
      min: -200,
      max: 200,
      range: true,
    });
    const collapseDirection = select('Direction', { left: 'left', right: 'right' }, 'left');
    const minSizes = object('Minimum Sizes', [50, 50, 50, 50]);
    const collapseTransition = number('Collapse Transition Speed (ms)', 500);
    const grabberSize = number('Grabber Size (px)', 10, { min: 1, max: 100, range: true });
    const buttonTransition = select(
      'Button Transition',
      {
        fade: 'fade',
        zoom: 'zoom',
        grow: 'grow',
        none: 'none',
      },
      'grow'
    );

    return (
      <Header>
        <SplitPane
          split="vertical"
          collapseOptions={{
            beforeToggleButton: <Button>{collapseDirection === 'left' ? '⬅' : '➡'}</Button>,
            afterToggleButton: <Button>{collapseDirection === 'left' ? '➡' : '⬅'}</Button>,
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
    const collapseDirection = select('Direction', { up: 'up', down: 'down' }, 'up');
    const resizerCss = object('Resizer CSS', {
      height: '1px',
      background: 'rgba(0, 0, 0, 0.1)',
    });
    const resizerHoverCss = object('Resizer Hover CSS', {
      height: '10px',
      marginTop: '-10px',
      backgroundImage:
        'radial-gradient(at center center,rgba(0,0,0,0.2) 0%,transparent 70%,transparent 100%)',
      backgroundSize: '100% 50px',
      backgroundPosition: '50% 0',
      backgroundRepeat: 'no-repeat',
      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    });
    const minSizes = object('minimum sizes', [50, 50, 50, 50]);
    return (
      <SplitPane
        split="horizontal"
        initialSizes={[340.75, 816.75, 273.75, 251.75]}
        minSizes={minSizes}
        collapseOptions={{
          beforeToggleButton: <Button>{collapseDirection === 'up' ? '⬆' : '⬇'}</Button>,
          afterToggleButton: <Button>{collapseDirection === 'up' ? '⬇' : '⬆'}</Button>,
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
  })
  .addDecorator(withKnobs);
