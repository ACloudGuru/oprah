const mockGetParameters = jest.fn();

jest.mock('../../services/parameter-store/make-parameter-store', () => ({
  makeParameterStore: () => ({
    getParameters: mockGetParameters
  })
}));

const path = require('path');

const { makeOprah } = require('../../make-oprah');

describe('fetch', () => {
  const oprah = makeOprah({
    stage: 'testing',
    config: path.resolve(__dirname, '../../../mocks/ssm-provider.yml')
  });

  it('should retreive the requested key', () => {
    mockGetParameters.mockImplementation(() =>
      Promise.resolve({
        john: 'doe',
        steph: 'curry'
      })
    );

    expect.assertions(1);

    return oprah.fetch({ key: '/abc/def/g' }).then(() => {
      expect(mockGetParameters.mock.calls[0][0]).toEqual({
        parameterNames: ['/abc/def/g']
      });
    });
  });

  it('should throw if no value is returned', () => {
    mockGetParameters.mockImplementation(() => Promise.resolve({}));

    expect.assertions(1);

    return expect(oprah.fetch({ key: '/abc/def/g' })).rejects.toThrow(
      'Could not find value'
    );
  });
});
