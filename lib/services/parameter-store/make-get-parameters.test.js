const mockGetAllParameters = jest.fn(() => Promise.resolve({
  CONFIG_1: 'config1',
  SECRET_1: 'secret1'
}));

const { makeGetParameters } = require('./make-get-parameters');



const getParameters = makeGetParameters({
  getProviderStore: () => Promise.resolve({
    getAllParameters: mockGetAllParameters
  })
});
describe('getParameters', () => {
  it('should get all parameters', () => {
    mockGetAllParameters.mockClear();

    expect.assertions(2);

    return getParameters({
      parameterNames: ['CONFIG_1', 'SECRET_1']
    })
      .then(res => {
        expect(res).toEqual({
          CONFIG_1: 'config1',
          SECRET_1: 'secret1'
        });

        expect(mockGetAllParameters.mock.calls[0][0]).toEqual({
          parameterNames: ['CONFIG_1', 'SECRET_1']
        })
      });
  });

  it('should return an empty object if no parameter names are parsed', () => {
    mockGetAllParameters.mockClear();

    expect.assertions(2);

    return getParameters({})
      .then(res => {
        expect(res).toEqual({});

        expect(mockGetAllParameters.mock.calls.length).toEqual(0)
      });
  });
});