'use strict';

const mockPut = jest.fn();
const mockGet = jest.fn();

jest.mock('aws-sdk', () => ({
  config: {
    setPromisesDependency: jest.fn(),
    update: jest.fn()
  },
  CloudFormation: function() {
    return { };
  },
  SSM: function() {
    return {
      putParameter: mockPut,
      getParametersByPath: mockGet
    };
  }
}));

const { populateSecret } = require('./index');

describe('populateConfig', () => {
  let result;

  beforeAll(() => {
    return populateSecret({
      secret: {
        path: 'config path'
      },
      noninteractive: true
    })
    .then(res => {
      result = res;
    });
  })

  it('should populate secret', () => {
    mockGet.mockImplementation(() => ({ promise: () => Promise.resolve({}) }));
    console.log(result);
    // expect(result).toEqual([]);
  });
});
