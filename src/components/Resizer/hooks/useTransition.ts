import { CollapseOptions, TransitionType } from '../../SplitPane';
import { useMemo } from 'react';
import { Fade, Grow, Zoom } from '@material-ui/core';
type TransitionComponent = typeof Fade | typeof Grow | typeof Zoom;
const transitionComponentMap: {
  [key in TransitionType]: TransitionComponent;
} = {
  fade: Fade,
  grow: Grow,
  zoom: Zoom,
  none: Fade,
};

export function useTransition(collapseOptions?: CollapseOptions) {
  return useMemo(() => transitionComponentMap[collapseOptions?.buttonTransition ?? 'fade'], [
    collapseOptions,
  ]);
}
