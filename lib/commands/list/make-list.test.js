const mockListParameters = jest.fn();
const mockGetParameters = jest.fn(() => Promise.resolve({
  john: 'doe',
  steph: 'curry'
}));

jest.mock('../../services/parameter-store/make-parameter-store', () => ({
  makeParameterStore: () => ({
    getParameters: mockGetParameters
  })
}))

jest.mock('./list-parameters', () => ({
  listParameters: mockListParameters
}));

const path = require('path');

const { makeOprah } = require('../../make-oprah');

describe('list', () => {
  let promise;

  const oprah = makeOprah({
    stage: 'testing',
    config: path.resolve(__dirname, '../../../mocks/ssm-provider.yml')
  });

  beforeAll(() => {
    promise = oprah.list();
  });

  it('should retrieve configs', () => {
    expect.assertions(1);

    return promise
    .then(() => {
      expect(mockGetParameters.mock.calls[0][0]).toEqual({
        parameterNames: [
        '/testing/oprah/config/DB_NAME',
        '/testing/oprah/config/DB_HOST',
        '/testing/oprah/config/DB_TABLE'
        ]
      });
    });
  });

  it('should list configs', () => {
    expect.assertions(1);

    return promise
    .then(() => {
      expect(mockListParameters.mock.calls[0][0]).toEqual({
        john: 'doe',
        steph: 'curry'
      });
    });
  });

  it('should retrieve secrets', () => {
    expect.assertions(1);

    return promise
    .then(() => {
      expect(mockGetParameters.mock.calls[1][0]).toEqual({
        parameterNames: [
        '/testing/oprah/secret/DB_PASSWORD'
        ]
      });
    });
  });

  it('should list secrets', () => {
    expect.assertions(1);

    return promise
    .then(() => {
      expect(mockListParameters.mock.calls[1][0]).toEqual({
        john: 'doe',
        steph: 'curry'
      });
    });
  });
});