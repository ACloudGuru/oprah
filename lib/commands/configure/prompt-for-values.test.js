const mockGet = jest.fn((data, cb) => cb(null, data));

jest.mock('chalk', () => ({
  green: text => text
}));

jest.mock('prompt', () => ({
  get: mockGet,
  start: () => {}
}));

const { promptForValues } = require('./prompt-for-values');

describe('promptForValues', () => {
  beforeAll(() => {
    return promptForValues({
      requiredValues: {
        hello: 'desc1',
        world: 'theworld.com'
      },
      currentValues: {
        world: 'CURRENT_WORLD_VALUE'
      }
    });
  })

  it('should prompt for all values that are required while defaulting to current value', () => {
    expect(mockGet.mock.calls[0][0]).toEqual([
      {
        default: '',
        description: 'Description: desc1\nhello:',
        name: 'hello',
        required: true,
        type: 'string'
      },
      {
        default: 'CURRENT_WORLD_VALUE',
        description: 'Description: theworld.com\nworld:',
        name: 'world',
        required: true,
        type: 'string'
      }
    ]);
  });
});