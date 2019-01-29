const mockPut = jest.fn();

const AWS = require('aws-sdk');
AWS.DynamoDB.DocumentClient.mockImplementation(function () {
  return {
    put: mockPut
  };
});

const { makePushParameter } = require('./make-push-parameter');

const pushParameter = makePushParameter({
  tableName: 'theTable'
});

describe('pushParameter', () => {
  describe('when a parameter is pushed successfully', () => {
    let pushPromise;

    beforeAll(() => {
      mockPut.mockImplementation(() => ({
        promise: () => Promise.resolve()
      }));

      pushPromise = pushParameter({
        name: 'theName',
        value: 'theValue',
        version: 'theVersion'
      });
    });

    it('should write the parameter to the designated dynamodb table and return the parameter', () => {
      expect.assertions(2);

      return pushPromise
      .then(res => {
        expect(mockPut.mock.calls[0][0].Item).toEqual({
          name: 'theName',
          value: 'theValue',
          version: 'theVersion'
        });

        expect(res).toEqual({
          name: 'theName',
          value: 'theValue',
          version: 'theVersion'
        });
      });
    });

    it('should not allow a parameter with the same version to be written', () => {
      expect.assertions(2);

      return pushPromise
      .then(() => {
        expect(mockPut.mock.calls[0][0].ConditionExpression).toEqual('attribute_not_exists(#name)');
        expect(mockPut.mock.calls[0][0].ExpressionAttributeNames).toEqual({
          '#name': 'name'
        });
      });
    });
  });

  describe('when a parameter is not pushed successfully', () => {
    it('should throw an error', () => {
      mockPut.mockImplementation(() => ({
        promise: () => Promise.reject(new Error('AWS does not like you'))
      }));

      return expect(pushParameter({
        name: 'theName',
        value: 'theValue',
        version: 'theVersion'
      })).rejects.toEqual(new Error(`Unable to update ${JSON.stringify({
        name: 'theName',
        value: 'theValue',
        version: 'theVersion'
      }, null, 2)}`));
    });
  });
});
