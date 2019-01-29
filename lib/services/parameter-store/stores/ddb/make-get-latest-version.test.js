const mockQuery = jest.fn();

jest.mock('./make-ddb-client', () => ({
  makeDdbClient: () => ({
    query: mockQuery
  })
}))

const { makeGetLatestVersion } = require('./make-get-latest-version');

const getLatestVersion = makeGetLatestVersion({
  tableName: 'the-test-table'
});

describe('getLatestVersion', () => {
  it('should get the latest version of a parameter', () => {
    mockQuery.mockImplementation(() => ({
      promise: () => Promise.resolve({
        Items: [
          {
            name: 'thename',
            version: 'theversion',
            value: 'theValue'
          }
        ]
      })
    }));

    expect.assertions(2);

    return getLatestVersion({ parameterName: 'theParam' })
    .then(result => {
      expect(mockQuery.mock.calls[0][0]).toEqual({
        Limit: 1,
        ConsistentRead: true,
        ScanIndexForward: false,
        KeyConditionExpression: '#name = :name',
        ExpressionAttributeNames: {
          '#name': 'name'
        },
        ExpressionAttributeValues: {
          ':name': 'theParam'
        }
      });

      expect(result).toEqual({
        name: 'thename',
        version: 'theversion',
        value: 'theValue'
      })
    });
  });

  it('should return an empty Item when the parameter cannott cannot be found', () => {
    mockQuery.mockImplementation(() => ({
      promise: () => Promise.reject(new Error('AWS error'))
    }));

    expect.assertions(1);

    return getLatestVersion({ parameterName: 'theParam' })
    .then(result => {
      expect(result).toEqual({})
    });
  })
});