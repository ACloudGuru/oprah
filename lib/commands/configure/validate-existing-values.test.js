const { validateExistingValues } = require('./validate-existing-values');

describe('validateExistingValues', () => {
  it('should return an empty object when there are no required values', () => {
    return expect(
      validateExistingValues({
        currentValues: {
          HELLO: 'WORLD'
        }
      })
    ).resolves.toEqual({});
  });

  it('should throw if required values are missing', () => {
    return expect(
      validateExistingValues({
        requiredValues: {
          HELLO: 'desc',
          FOO: 'desc'
        },
        currentValues: {
          HELLO: 'WORLD'
        }
      })
    ).rejects.toThrow('Missing required configs!! Run on interactive mode to populate them!!');
  });

  it('should return current values only if it is not missing any required values', () => {
    return expect(
      validateExistingValues({
        requiredValues: {
          HELLO: 'desc',
          FOO: 'desc'
        },
        currentValues: {
          HELLO: 'WORLD',
          FOO: 'BAR',
          OTHER: 'STUFF',
          NOT: 'REQUIRED'
        }
      })
    ).resolves.toEqual({
      HELLO: 'WORLD',
      FOO: 'BAR'
    });
  })
});
