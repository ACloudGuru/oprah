const mockGray = jest.fn();

jest.mock('chalk', () => ({
  gray: mockGray
}));

const { makeUpdateConfigs } = require('./make-update-configs');

const mockProviderUpdateConfigs = jest.fn(() => Promise.resolve());

const updateConfigs = makeUpdateConfigs({
  getProviderStore: () => Promise.resolve({
    updateConfigs: mockProviderUpdateConfigs
  })
});

describe('updateConfigs', () => {
  it(`should update config using the provider store`, () => {
    return updateConfigs({
      parameters: {
        'HELLO_1': 'hello',
        'HELLO_2': 'world'
      }
    })
    .then(() => {
      expect(mockProviderUpdateConfigs.mock.calls[0][0].parameters).toEqual({
        HELLO_1: 'hello',
        HELLO_2: 'world'
      });
    });
  });

  it('should provide a callback onComplete to allow for logging', () => {
    return updateConfigs({
      parameters: {
        'HELLO_1': 'hello',
        'HELLO_2': 'world'
      }
    })
    .then(() => {
      mockProviderUpdateConfigs.mock.calls[0][0].onComplete({
        key: 'THE KEY',
        value: 'theValue'
      });

      expect(mockGray.mock.calls[0][0]).toEqual('Updated config: Name: THE KEY | Value: [theValue]');
    });
  });
});
