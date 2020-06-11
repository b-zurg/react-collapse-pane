import React from 'react';
import * as ReactDOM from 'react-dom';
import {
  HorizontalSplitWithDivs,
  VerticalSplitWithDivs,
} from '../stories/Thing.stories';

describe('Vertical', () => {
  it('Split with Divs renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<VerticalSplitWithDivs />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

describe('Horizontal', () => {
  it('Split with Divs renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<HorizontalSplitWithDivs />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
