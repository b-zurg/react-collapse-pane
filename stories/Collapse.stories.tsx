import styled from 'styled-components';
import { SplitPane } from '../src/components/SplitPane';
import { storiesOf } from '@storybook/react';
import { action, configureActions } from '@storybook/addon-actions';
import React from 'react';
import { select, withKnobs, object, number } from '@storybook/addon-knobs';

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

storiesOf('Collapsable Panes', module)
  .add('Vertical Split', () => {
    const buttonPositionOffset = number('Button Position Offset', 0, {
      min: -200,
      max: 200,
      range: true,
    });
    const collapseDirection = select('Direction', { left: 'left', right: 'right' }, 'left');
    const resizerCss = object('Resizer CSS', {
      width: '1px',
      background: 'rgba(0, 0, 0, 0.1)',
    });
    const resizerHoverCss = object('Resizer Hover CSS', {
      width: '10px',
      marginLeft: '-10px',
      backgroundImage:
        'radial-gradient(at center center,rgba(0,0,0,0.2) 0%,transparent 70%,transparent 100%)',
      backgroundSize: '50px 100%',
      backgroundPosition: '0 50%',
      backgroundRepeat: 'no-repeat',
      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    });
    const minSizes = object('Minimum Sizes', [50, 50, 50, 50]);
    const collapseTransition = number('Collapse Transition Speed (ms)', 500);

    return (
      <SplitPane
        split="vertical"
        collapseOptions={{
          beforeToggleButton: <Button>{collapseDirection === 'left' ? '⬅' : '➡'}</Button>,
          afterToggleButton: <Button>{collapseDirection === 'left' ? '➡' : '⬅'}</Button>,
          collapsedSize: 40,
          collapseTransitionTimeout: collapseTransition,
          collapseDirection,
          buttonPositionOffset,
        }}
        minSizes={minSizes}
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
          collapsedSize: 40,
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
