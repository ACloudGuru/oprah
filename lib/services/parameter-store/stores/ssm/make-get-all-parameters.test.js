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
            Name: 'TEST/FIVE',
            Value: '5',
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
            Name: 'TEST/EIGHT',
            Value: '8',
          },
          {
            Name: 'TEST/NINE',
            Value: '9',
          },
          {
            Name: 'TEST/TEN',
            Value: '10',
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
    }))

const AWS = require('aws-sdk');
AWS.SSM.mockImplementation(function () {
  return {
    getParameters: mockGetParameters
  };
});

const { makeSsmStore } = require('./make-ssm-store');

describe('getAllParameters', () => {
  let resultPromise;

  beforeAll(() => {
    const ssmStore = makeSsmStore();
    const getAllParameters = ssmStore.getAllParameters;
    resultPromise = getAllParameters({
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

  it('should merge the results of all the request to ssm and strip the path', () => {
    return resultPromise
    .then(res => {
      expect(res).toEqual({
        ONE: '1',
        TWO: '2',
        THREE: '3',
        FOUR: '4',
        FIVE: '5',
        SIX: '6',
        SEVEN: '7',
        EIGHT: '8',
        NINE: '9',
        TEN: '10',
        ELEVEN: '11'
      });
    });
  })
});
