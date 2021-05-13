import { SplitPane } from '../src';
import { storiesOf } from '@storybook/react';
import { action, configureActions } from '@storybook/addon-actions';
import React from 'react';

configureActions({
  depth: 5,
  limit: 5,
});

storiesOf('Right to Left Support', module)
  .add('Vertical Split', () => {
    const collapseDirection = 'left';
    const resizerCss = {
      width: '1px',
      background: 'rgba(0, 0, 0, 0.1)',
    };
    const resizerHoverCss = {
      width: '10px',
      marginLeft: '-10px',
      backgroundImage:
        'radial-gradient(at center center,rgba(0,0,0,0.2) 0%,transparent 70%,transparent 100%)',
      backgroundSize: '50px 100%',
      backgroundPosition: '0 50%',
      backgroundRepeat: 'no-repeat',
      borderRight: '1px solid rgba(0, 0, 0, 0.1)',
    };
    return (
      <div style={{ direction: 'rtl' }}>
        <SplitPane
          split="vertical"
          dir="rtl"
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
          <div>اللوحة الأولى</div>
          <div>اللوحة الثانية</div>
          <div>اللوحة الثالثة</div>
          <div>اللوحة الرابعة</div>
        </SplitPane>
      </div>
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
    return (
      <div style={{ direction: 'rtl' }}>
        <SplitPane
          split="horizontal"
          initialSizes={[340.75, 816.75, 273.75, 251.75]}
          // direction="rtl"
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
          <div>اللوحة الأولى</div>
          <div>اللوحة الثانية</div>
          <div>اللوحة الثالثة</div>
          <div>اللوحة الرابعة</div>
        </SplitPane>
      </div>
    );
  });
