import { moveSizes } from '../helpers';

test('Move right does not extend past default minimum (50)', () => {
  const sizes = [138, 138, 193, 83];
  moveSizes({
    sizes,
    index: 2,
    offset: 36,
    minSizes: [50, 50, 50, 50],
    collapsedSize: 50,
    collapsedIndices: [],
  });
  expect(sizes).toEqual([138, 138, 226, 50]);
  moveSizes({
    sizes,
    index: 0,
    offset: 1000,
    minSizes: [50, 50, 50, 50],
    collapsedSize: 50,
    collapsedIndices: [],
  });
  expect(sizes).toEqual([402, 50, 50, 50]);
});
test('Move left does not extend past default minimum (50)', () => {
  const sizes = [138, 138, 193, 83];
  moveSizes({
    sizes,
    index: 2,
    offset: -1000,
    minSizes: [50, 50, 50, 50],
    collapsedSize: 50,
    collapsedIndices: [],
  });
  expect(sizes).toEqual([50, 50, 50, 402]);
});
