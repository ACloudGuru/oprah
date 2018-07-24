'use strict';

jest.mock('aws-sdk', () => {
  const getParameters = jest.fn();
  const SSM = jest.fn();

  SSM.mockImplementation(function() {
    this.getParameters = getParameters;
  });

  return {
    SSM,
    config: {
      setPromisesDependency: jest.fn(),
      update: jest.fn()
    }
  };
});

const AWS = require('aws-sdk');
const ssm = new AWS.SSM({});
ssm.getParameters
.mockImplementationOnce(() => ({
  promise: () => Promise.resolve({
    Parameters: [
      {
        Name: '/path/to/third',
        Value: '3rd'
      },
      {
        Name: '/path/to/second',
        Value: '2nd'
      },
      {
        Name: '/path/to/first',
        Value: '1st'
      },
      {
        Name: '/path/to/fourth',
        Value: '4th'
      },
      {
        Name: '/path/to/fifth',
        Value: '5th'
      },
      {
        Name: '/path/to/sixth',
        Value: '6th'
      },
      {
        Name: '/path/to/seventh',
        Value: '7th'
      },
      {
        Name: '/path/to/eighth',
        Value: '8th'
      },
      {
        Name: '/path/to/ninth',
        Value: '9th'
      },
      {
        Name: '/path/to/tenth',
        Value: '10th'
      }
    ],
    InvalidParameters: []
  })
}))
.mockImplementationOnce(() => ({
  promise: () => Promise.resolve({
    Parameters: [
      {
        Name: '/path/to/twelfth',
        Value: '12th'
      },
      {
        Name: '/path/to/eleventh',
        Value: '11th'
      },
    ],
    InvalidParameters: []
  })
}))

const { getParameters } = require('../index');

describe('#getParameters - validParameters', () => {
  const request = () => getParameters({
    paths: [
      '/path/to/first',
      '/path/to/second',
      '/path/to/third',
      '/path/to/fourth',
      '/path/to/fifth',
      '/path/to/sixth',
      '/path/to/seventh',
      '/path/to/eighth',
      '/path/to/ninth',
      '/path/to/tenth',
      '/path/to/eleventh',
      '/path/to/twelfth',
    ]
  });

  beforeAll(() => request());

  it('should cache the resolved values', () => {
    return request()
    .then(() => request())
    .then(() => request())
    .then(() => request())
    .then(() => request())
    .then(() => {
      expect(ssm.getParameters.mock.calls.length).toEqual(2);
    });
  });

  it('should return a requested parameters in the order it was requested in', () => {
    return request()
    .then(parameters => {
      expect(parameters).toEqual(['1st', '2nd','3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']);
    });
  });

  it('should chunk the request when it exceeds 10', () => {
    expect(ssm.getParameters.mock.calls[0][0]).toEqual({
      Names: [
        '/path/to/first',
        '/path/to/second',
        '/path/to/third',
        '/path/to/fourth',
        '/path/to/fifth',
        '/path/to/sixth',
        '/path/to/seventh',
        '/path/to/eighth',
        '/path/to/ninth',
        '/path/to/tenth',
      ],
      WithDecryption: true
    });

    expect(ssm.getParameters.mock.calls[1][0]).toEqual({
      Names: [
        '/path/to/eleventh',
        '/path/to/twelfth',
      ],
      WithDecryption: true
    });
  });
});
