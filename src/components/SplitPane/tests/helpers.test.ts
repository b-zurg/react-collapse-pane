import { moveSizes } from '../helpers';

test('Move right does not extend past default minimum (50)', () => {
  expect(
    moveSizes({
      sizes: [138, 138, 193, 83],
      index: 2,
      offset: 36,
      isLtr: true,
      minSizes: [50, 50, 50, 50],
      collapsedIndices: [],
    })
  ).toEqual([138, 138, 226, 50]);
});
