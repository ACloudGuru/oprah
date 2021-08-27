const mockGetAllParameters = jest.fn();
const mockDeleteParameters = jest.fn();

jest.mock('../../services/parameter-store/make-parameter-store', () => ({
  makeParameterStore: () => ({
    getAllParameters: mockGetAllParameters,
    deleteParameters: mockDeleteParameters
  })
}));

jest.mock('../../services/settings/make-settings-service', () => ({
  makeSettingsService: () => ({
    getSettings: () =>
      Promise.resolve({
        config: {
          path: '/test/config'
        },
        secret: {
          path: '/test/secret'
        },
        configParameters: ['/test/config/ONE', '/test/config/TWO'],
        secretParameters: ['/test/secret/FOUR']
      })
  })
}));

const path = require('path');

const { makeOprah } = require('../../make-oprah');

describe('cleanup', () => {
  const oprah = makeOprah({
    stage: 'testing',
    config: path.resolve(__dirname, '../../../mocks/ssm-provider.yml')
  });

  it('should delete unused parameters', async () => {
    mockGetAllParameters.mockResolvedValueOnce([
      {
        Name: '/test/config/ONE',
        Type: 'String',
        Value: '3200',
        Version: 1,
        DataType: 'text'
      },
      {
        Name: '/test/config/TWO',
        Type: 'String',
        Value: 'my-database',
        Version: 1,
        DataType: 'text'
      },
      {
        Name: '/test/config/THREE',
        Type: 'String',
        Value: 'test-table',
        Version: 1,
        DataType: 'text'
      }
    ]);
    mockGetAllParameters.mockResolvedValueOnce([
      {
        Name: '/test/secret/FOUR',
        Type: 'String',
        Value: 'disabled',
        Version: 1,
        DataType: 'text'
      }
    ]);
    mockDeleteParameters.mockResolvedValue({});

    await oprah.cleanup();
    expect.assertions(4);
    expect(mockGetAllParameters.mock.calls.length).toEqual(2);
    expect(mockGetAllParameters.mock.calls[0][0].path).toEqual('/test/config');
    expect(mockGetAllParameters.mock.calls[1][0].path).toEqual('/test/secret');
    expect(mockDeleteParameters.mock.calls[0][0].parameterNames).toEqual([
      '/test/config/THREE'
    ]);
  });
});
