import * as React from 'react';
import { SplitType } from 'components/SplitPane';

export interface PaneProps {
  size: number;
  minSize: number;

  split: SplitType;
  className: string;

  forwardRef: React.Ref<HTMLDivElement>;

  children: React.ReactNode;
}

const baseStyle: React.CSSProperties = {
  position: 'relative',
  outline: 'none',
  border: 0,
  overflow: 'hidden',
  display: 'flex',
  flexBasis: 'auto',
};

export const Pane = React.memo(
  ({ size, minSize, split, className, forwardRef, children }: PaneProps) => {
    const style: React.CSSProperties = {
      ...baseStyle,
      flexGrow: size,
      flexShrink: size,
    };

    if (split === 'vertical') {
      style.width = 0;
      style.height = '100%';
      style.minWidth = minSize;
    } else {
      style.width = '100%';
      style.height = 0;
      style.minHeight = minSize;
    }

    const classes = ['Pane', split, className].join(' ');

    return (
      <div className={classes} style={style} ref={forwardRef}>
        {children}
      </div>
    );
  }
);
Pane.displayName = 'Pane';
