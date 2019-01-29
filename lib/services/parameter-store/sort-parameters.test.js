const { sortParameters } = require('./sort-parameters');

describe('sortParameters', () => {
  it('should sort parameters by key in alphabetical order', () => {
    const result = sortParameters({
      B: 'b',
      A: 'a',
      D: 'd'
    });

    expect(result).toStrictEqual({
      A: 'a',
      B: 'b',
      D: 'd'
    });
  });
});