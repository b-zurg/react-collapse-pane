import React from 'react';
import { SplitPaneProps, SplitPaneView } from '../components/SplitPane';
import { SplitPaneProvider } from './SplitPaneProvider';

export const SplitPane = (props: SplitPaneProps) => {
  return (
    <SplitPaneProvider>
      <SplitPaneView {...props} />
    </SplitPaneProvider>
  );
};
