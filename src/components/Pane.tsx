import React, { useMemo, forwardRef } from 'react';
import { stringifyStyle } from './helpers';

export interface PaneProps {
  split?: 'vertical' | 'horizontal';
  size: React.CSSProperties['width'];
  order: 1 | 2;
  children: React.ReactNode;
}

export type PaneRef = HTMLDivElement | null;

export const Pane = forwardRef<PaneRef, PaneProps>((props, forwardedRef) => {
  const style = useMemo(() => {
    const res: React.CSSProperties = {
      flex: 1,
      position: 'relative',
      outline: 'none',
    };

    if (props.size !== undefined) {
      if (props.split === 'vertical') {
        res.width = props.size;
      } else {
        res.height = props.size;
        res.display = 'flex';
      }
      res.flex = 'none';
    }

    return res;
  }, [stringifyStyle(props.style), props.size, props.split]);

  const className = ['Pane', props.split, `Pane${props.order}`].join(' ');

  return (
    <div
      key={`pane${props.order}`}
      ref={forwardedRef}
      className={className}
      style={style}
    >
      {props.children}
    </div>
  );
});
