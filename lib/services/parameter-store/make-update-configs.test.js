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
    mockGray.mockClear();

    return updateConfigs({
      parameters: {
        'HELLO_1': 'hello',
        'HELLO_2': 'world'
      }
    })
    .then(() => {
      const onCompleteHook = mockProviderUpdateConfigs.mock.calls[0][0].onComplete

      onCompleteHook({
        name: 'THE KEY',
        value: 'theValue',
        version: '000000000002'
      });

      expect(mockGray.mock.calls[0][0]).toEqual('Updating config...');
      expect(mockGray.mock.calls[1][0]).toEqual('Config updated');
      expect(mockGray.mock.calls[2][0]).toEqual('Updated config: Name: THE KEY | Value: [theValue] | Version: [000000000002]');
    });
  });
});
