const mockGray = jest.fn();

jest.mock('chalk', () => ({
  gray: mockGray
}));

const { makeUpdateSecrets } = require('./make-update-secrets');

const mockProviderUpdateSecrets = jest.fn(() => Promise.resolve());

const updateSecrets = makeUpdateSecrets({
  getProviderStore: () => Promise.resolve({
    updateSecrets: mockProviderUpdateSecrets
  })
});

describe('updateSecrets', () => {
  it(`should update secrets using the provider store`, () => {
    return updateSecrets({
      parameters: {
        'HELLO_1': 'hello',
        'HELLO_2': 'world'
      }
    })
    .then(() => {
      expect(mockProviderUpdateSecrets.mock.calls[0][0].parameters).toEqual({
        HELLO_1: 'hello',
        HELLO_2: 'world'
      });
    });
  });

  it('should provide a callback onComplete to allow for logging', () => {
    mockGray.mockClear();

    return updateSecrets({
      parameters: {
        'HELLO_1': 'hello',
        'HELLO_2': 'world'
      }
    })
    .then(() => {
      const onCompleteHook = mockProviderUpdateSecrets.mock.calls[0][0].onComplete

      onCompleteHook({
        name: 'THE KEY',
        value: 'theValue',
        version: '00000000003'
      });

      expect(mockGray.mock.calls[0][0]).toEqual('Updating secrets...');
      expect(mockGray.mock.calls[1][0]).toEqual('Secrets updated');
      expect(mockGray.mock.calls[2][0]).toEqual('Updated secret: Name: THE KEY | Value: [8 chars] | Version: [00000000003]');
    });
  });
});
