import React from 'react';
import * as ReactDOM from 'react-dom';
import { SplitPaneProps, SplitPane } from '../src';

const SplitPaneBase: React.FC<SplitPaneProps> = props => (
  <SplitPane
    collapse={{
      collapsedSize: 40,
      collapseDirection: 'right',
    }}
    {...props}
  >
    {props.children}
  </SplitPane>
);

describe('Vertical', () => {
  it('Split with Divs renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <SplitPaneBase split="vertical">
        <div>This is a div</div>
        <div>This is a second div</div>
        <div>This is a third div</div>
        This is not a fourth div
      </SplitPaneBase>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
  it('Split with only one child renders without crashing', () => {
    console.error = jest.fn();
    const div = document.createElement('div');
    ReactDOM.render(
      // @ts-ignore ignore type error to help out javascript users as they won't get it.
      <SplitPaneBase split="vertical">
        <div>This is not a fourth div</div>
      </SplitPaneBase>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(
      '[react-collapse-pane] - You must have more than one non-null child inside the SplitPane component.  Even though SplitPane does not crash, you should resolve this error.'
    );
  });
});

describe('Horizontal', () => {
  it('Split with Divs, nulls, and text renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <SplitPaneBase split="horizontal">
        <div>This is a div</div>
        <div>This is a second div</div>
        <div>This is a third div</div>
        This is not a fourth div
      </SplitPaneBase>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
