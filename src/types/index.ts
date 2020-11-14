import { Action } from 'easy-peasy';

export interface BaseStates {
  collapsedIndices: Array<number>;
  setCollapsed: Action<BaseStates, Array<number>>;
  toggleCollapse: Action<BaseStates, number>;
}
