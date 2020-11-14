import React from 'react';
import { StoreProvider, useStore } from 'easy-peasy';
import store from '../store';

interface Props {
  children: React.ReactNode;
}

/* We shuold provide store only once so if user uses Provider for particular usecase
// we check it here */
export const SplitPaneProvider = ({ children }: Props) => {
  if (useStore()?.getState()) {
    return <>{children}</>;
  }
  return <StoreProvider store={store}>{children}</StoreProvider>;
};

SplitPaneProvider.displayName = 'SplitPaneProvider';
SplitPaneProvider.key = 'SplitPaneProvider';
