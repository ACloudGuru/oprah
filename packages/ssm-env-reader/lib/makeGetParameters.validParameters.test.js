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
        Name: '/path/to/first',
        Value: '1st'
      },
      {
        Name: '/path/to/second',
        Value: '2nd'
      }
    ],
    InvalidParameters: []
  })
}))
.mockImplementationOnce(() => ({
  promise: () => Promise.resolve({
    Parameters: [
      {
        Name: '/path/to/third',
        Value: '3rd'
      }
    ],
    InvalidParameters: []
  })
}));

const { makeGetParameters } = require('../index');



const getParameters = makeGetParameters({ chunkSize: 2 });

describe('#makeGetParameters - validParameters', () => {
  const request = () => getParameters({
    paths: [
      '/path/to/first',
      '/path/to/second',
      '/path/to/third',
    ]
  });

  beforeAll(() => request());

  it('should chunk requests according to the chunkSize setting', () => {
    expect(ssm.getParameters.mock.calls.length).toEqual(2);

    expect(ssm.getParameters.mock.calls[0][0]).toEqual({
      Names: [
        '/path/to/first',
        '/path/to/second',
      ],
      WithDecryption: true
    });

    expect(ssm.getParameters.mock.calls[1][0]).toEqual({
      Names: [
        '/path/to/third',
      ],
      WithDecryption: true
    });
  });

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

  it('should return a map of values', () => {
    return request()
    .then(parameterMap => {
      expect(parameterMap).toEqual({
        first: '1st',
        second: '2nd',
        third: '3rd'
      });
    });
  });
});
