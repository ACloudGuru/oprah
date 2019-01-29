jest.unmock('aws-sdk');

const { makeDdbClient } = require('./make-ddb-client');

describe('makeDdbClient', () => {
  it('should create a dynamodb client with the provided tableName', () => {
    const ddbClient = makeDdbClient({ tableName: 'thetesttable' });

    expect(ddbClient.options.params).toEqual({
      TableName: 'thetesttable'
    });
  });
});