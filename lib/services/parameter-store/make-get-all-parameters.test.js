const mockGetAllParameters = jest.fn(() =>
  Promise.resolve([
    {
      Name: '/test/ONE',
      Type: 'String',
      Value: '3200',
      Version: 1,
      DataType: 'text'
    },
    {
      Name: '/test/TWO',
      Type: 'String',
      Value: 'my-database',
      Version: 1,
      DataType: 'text'
    },
    {
      Name: '/test/THREE',
      Type: 'String',
      Value: 'test-table',
      Version: 1,
      DataType: 'text'
    },
    {
      Name: '/test/FOUR',
      Type: 'String',
      Value: 'disabled',
      Version: 1,
      DataType: 'text'
    }
  ])
);

const { makeGetAllParameters } = require('./make-get-all-parameters');

const getAllParameters = makeGetAllParameters({
  getProviderStore: () =>
    Promise.resolve({
      getAllParametersByPath: mockGetAllParameters
    })
});
describe('getAllParameters', () => {
  it('should get all parameters', () => {
    mockGetAllParameters.mockClear();

    expect.assertions(2);

    return getAllParameters({
      path: '/test'
    }).then(res => {
      expect(res).toEqual([
        {
          Name: '/test/ONE',
          Type: 'String',
          Value: '3200',
          Version: 1,
          DataType: 'text'
        },
        {
          Name: '/test/TWO',
          Type: 'String',
          Value: 'my-database',
          Version: 1,
          DataType: 'text'
        },
        {
          Name: '/test/THREE',
          Type: 'String',
          Value: 'test-table',
          Version: 1,
          DataType: 'text'
        },
        {
          Name: '/test/FOUR',
          Type: 'String',
          Value: 'disabled',
          Version: 1,
          DataType: 'text'
        }
      ]);

      expect(mockGetAllParameters.mock.calls[0][0]).toEqual({
        path: '/test'
      });
    });
  });
});
