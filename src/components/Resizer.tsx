import React from 'react';

import { ClientPosition } from './hooks';
const { useCallback } = React;

export interface ResizerProps {
  split: 'horizontal' | 'vertical';
  className: string;
  index: number;
  collapseButton?: React.ReactElement;
  onDragStarted: (index: number, pos: ClientPosition) => void;
}

export const Resizer = React.memo(
  ({ split, className, index, onDragStarted }: ResizerProps) => {
    const handleMouseDown = useCallback(
      (event: React.MouseEvent) => {
        event.preventDefault();

        onDragStarted(index, event);
      },
      [index, onDragStarted]
    );

    const handleTouchStart = useCallback(
      (event: React.TouchEvent) => {
        event.preventDefault();

        onDragStarted(index, event.touches[0]);
      },
      [index, onDragStarted]
    );

    const classes = ['Resizer', split, className].join(' ');

    return (
      <>
        <div
          role="presentation"
          className={classes}
          style={{ flex: 'none' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
      </>
    );
  }
);
Resizer.displayName = 'Resizer';
