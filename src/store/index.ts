import { createStore, action } from 'easy-peasy';
import { BaseStates } from '../types';

const baseStates: BaseStates = {
  collapsedIndices: [],
  setCollapsed: action((state, collapsedIndices) => {
    state.collapsedIndices = collapsedIndices;
  }),
  toggleCollapse: action((state, index) => {
    state.collapsedIndices.includes(index)
      ? (state.collapsedIndices = state.collapsedIndices.filter((i: number) => i !== index))
      : (state.collapsedIndices = [...state.collapsedIndices, index]);
  }),
};

export interface StoreModel {
  baseStates: BaseStates;
}

const store = createStore({ baseStates });

export default store;
