const mockGetParameters = jest.fn();

jest.mock('../../services/parameter-store/make-parameter-store', () => ({
  makeParameterStore: () => ({
    getParameters: mockGetParameters
  })
}));

jest.mock('../../services/settings/make-settings-service', () => ({
  makeSettingsService: () => ({
    getSettings: () =>
      Promise.resolve({
        configParameters: ['/test/john', '/test/steph'],
        secretParameters: ['/test/SOME_SECRET']
      })
  })
}));

const path = require('path');

const { makeOprah } = require('../../make-oprah');

describe('fetch', () => {
  const oprah = makeOprah({
    stage: 'testing',
    config: path.resolve(__dirname, '../../../mocks/ssm-provider.yml')
  });

  it('should retreive the requested keys', () => {
    mockGetParameters.mockImplementation(() =>
      Promise.resolve({
        john: 'doe',
        steph: 'curry'
      })
    );

    expect.assertions(1);

    return oprah.fetch({ keys: ['john', 'steph'] }).then(() => {
      expect(mockGetParameters.mock.calls[0][0]).toEqual({
        parameterNames: ['/test/john', '/test/steph']
      });
    });
  });

  it('should retreive the requested keys only if they exist', () => {
    mockGetParameters.mockImplementation(() =>
      Promise.resolve({
        john: 'doe',
        steph: 'curry'
      })
    );

    expect.assertions(1);

    return oprah.fetch({ keys: ['john', 'steph', 'test'] }).then(() => {
      expect(mockGetParameters.mock.calls[0][0]).toEqual({
        parameterNames: ['/test/john', '/test/steph']
      });
    });
  });
});
