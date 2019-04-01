const AWS = require('aws-sdk');
const mockGetCallIdentity = jest.fn();

AWS.STS.mockImplementation(function() {
  return {
    getCallerIdentity: mockGetCallIdentity
  }
});

const { getAccountId } = require('./get-account-id');

describe('getAccountId', () => {
  it('should get the account Id', () => {
    mockGetCallIdentity.mockImplementation(() => ({
      promise: () => Promise.resolve({
        Account: '12344556',
        Arn: 'eyAreEn',
        UserId: 'useruserId'
      })
    }));

    return expect(getAccountId()).resolves.toEqual('12344556');
  });

  it('should throw if the account Id is missing', () => {
    mockGetCallIdentity.mockImplementation(() => ({
      promise: () => Promise.resolve({
        Arn: 'eyAreEn',
        UserId: 'useruserId'
      })
    }));

    return expect(getAccountId()).rejects.toThrow('Could not get accountId');
  });
});

