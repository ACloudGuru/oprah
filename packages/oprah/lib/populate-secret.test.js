'use strict';

const path = require('path');
const Bluebird = require('bluebird');

const mockPut = jest.fn();
jest.mock('aws-sdk', () => ({
  config: {
    setPromisesDependency: jest.fn(),
    update: jest.fn()
  },
  CloudFormation: function() {
    return { };
  },
  SSM: function() {
    return { putParameter: mockPut };
  }
}));


const secretStore = require('../lib/secret-store');
secretStore.readRemoteConfigs = jest.fn();

const { populateSecret } = require('../index');

describe('#populateSecret', () => {

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('should throw an error invalid ssmPath is invalid', () => {
    return populateSecret({})
      .catch(error => {
        expect(error.message).toEqual('Please specify ssmPath for populateSecret');
      });
  });

  describe('when running on non interactive mode', () => {
    const requiredPath = path.resolve(__dirname, '../mocks/required.yml');
    const ssmPath = '/path/to/fake/ssm';
    const keyId = 'fakeKeyId';
    const noninteractive = true;

    it('should throw error if required config is not already populated', () => {
      secretStore.readRemoteConfigs.mockImplementation(() => Bluebird.resolve({}));

      return populateSecret({ requiredPath, ssmPath,  keyId, noninteractive})
        .catch(error => expect(error.message).toEqual('Missing required configs!!'));
    });

    it('should populate secrets', () => {
      const secrets = { REQUIRED_SECRET: '123', ANOTHER_REQUIRED_SECRET: '234' };
      secretStore.readRemoteConfigs.mockImplementation(() => Bluebird.resolve(secrets));
      mockPut.mockImplementation(() => ({ promise: () => Bluebird.resolve(true) }));

      return populateSecret({ requiredPath, ssmPath,  keyId, noninteractive})
        .then(response => {
          expect(response).toEqual({
            REQUIRED_SECRET: '123',
            ANOTHER_REQUIRED_SECRET: '234'
          });
          expect(mockPut).toHaveBeenCalledTimes(2);

          expect(mockPut.mock.calls[0][0]).toEqual({
            Name: '/path/to/fake/ssm/REQUIRED_SECRET',
            Type: 'SecureString',
            Value: '123',
            Overwrite: true,
            KeyId: 'fakeKeyId'
          });

          expect(mockPut.mock.calls[1][0]).toEqual({
            Name: '/path/to/fake/ssm/ANOTHER_REQUIRED_SECRET',
            Type: 'SecureString',
            Value: '234',
            Overwrite: true,
            KeyId: 'fakeKeyId'
          });
        });
    });
  });
});
