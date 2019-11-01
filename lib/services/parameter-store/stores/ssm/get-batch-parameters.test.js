const Bluebird = require('bluebird');

const mockGetParameters = jest.fn()
  .mockImplementationOnce(() => ({
    promise: () => Bluebird.resolve({
      Parameters: [
        {
          Name: 'TEST/ONE',
          Value: '1',
        },
        {
          Name: 'TEST/TWO',
          Value: '2',
        },
        {
          Name: 'TEST/THREE',
          Value: '3',
        },
        {
          Name: 'TEST/FOUR',
          Value: '4',
        },
        {
          Name: 'TEST/SIX',
          Value: '6',
        },
        {
          Name: 'TEST/SEVEN',
          Value: '7',
        },
        {
          Name: 'TEST/NINE',
          Value: '9',
        },
        {
          Name: 'TEST/TEN',
          Value: '10',
        }
      ],
      InvalidParameters: [
        {
          Name: 'TEST/FIVE',
          Value: '5',
        },
        {
          Name: 'TEST/EIGHT',
          Value: '8',
        },
      ]
    })
  }))
  .mockImplementationOnce(() => ({
    promise: () => Bluebird.resolve({
      Parameters: [
        {
          Name: 'TEST/ELEVEN',
          Value: '11',
        },
      ]
    })
  }));

const AWS = require('aws-sdk');
AWS.SSM.mockImplementation(function () {
  return {
    getParameters: mockGetParameters
  };
});

const { getBatchParameters } = require('./get-batch-parameters');

describe('getBatchParameters', () => {
  let resultPromise;

  beforeAll(() => {
    resultPromise = getBatchParameters({
      parameterNames: [
        'TEST/ONE',
        'TEST/TWO',
        'TEST/THREE',
        'TEST/FOUR',
        'TEST/FIVE',
        'TEST/SIX',
        'TEST/SEVEN',
        'TEST/EIGHT',
        'TEST/NINE',
        'TEST/TEN',
        'TEST/ELEVEN'
      ]
    });
    return resultPromise;
  });

  it('should get all the parameters in ssm in chunks of ten due to api limits', () => {
    expect(mockGetParameters.mock.calls[0][0]).toEqual({
      Names: [
        'TEST/ONE',
        'TEST/TWO',
        'TEST/THREE',
        'TEST/FOUR',
        'TEST/FIVE',
        'TEST/SIX',
        'TEST/SEVEN',
        'TEST/EIGHT',
        'TEST/NINE',
        'TEST/TEN'
      ],
      WithDecryption: true
    });

    expect(mockGetParameters.mock.calls[1][0]).toEqual({
      Names: [
        'TEST/ELEVEN'
      ],
      WithDecryption: true
    });
  });

  it('should merge the results of all the request to ssm and strip the path and handle non-existant parameters', () => {
    return resultPromise
    .then(res => {
      expect(res).toEqual([
        '1',
        '2',
        '3',
        '4',
        '',
        '6',
        '7',
        '',
        '9',
        '10',
        '11'
      ]);
    });
  })
});
