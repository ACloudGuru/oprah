'use strict';

const mockGetParameters = jest.fn();
jest.mock('./getParameters', () => ({ getParameters: mockGetParameters }));

const { makeParameterStore } = require('./makeParameterStore');

describe('#ParameterStore', () => {

  beforeEach(() => jest.clearAllMocks());

  it ('should return a config for a given key', () => {
    const configPath = '/stage/config';
    const secretPath = '/stage/secret';

    mockGetParameters.mockImplementation(() => Promise.resolve(['config value']));

    const parameterStore = makeParameterStore({ configPath, secretPath });

    return parameterStore
      .getConfig('SOME_CONFIG')
      .then(config => {
        expect(config).toEqual('config value');
        expect(mockGetParameters.mock.calls[0][0]).toEqual({
          paths: [ '/stage/config/SOME_CONFIG' ]
        });
      });
  });

  it ('should return configs for a given keys', () => {
    const configPath = '/stage/config';
    const secretPath = '/stage/secret';

    mockGetParameters.mockImplementation(() => Promise.resolve(['config 1', 'config 2']));

    const parameterStore = makeParameterStore({ configPath, secretPath });

    return parameterStore
      .getConfigs(['CONFIG_1', 'CONFIG_2'])
      .then(configs => {
        expect(configs).toEqual(['config 1', 'config 2']);
        expect(mockGetParameters.mock.calls[0][0]).toEqual({
          paths: [ '/stage/config/CONFIG_1', '/stage/config/CONFIG_2' ]
        });
      });
  });

  it ('should return secrets for a given keys', () => {
    const configPath = '/stage/config';
    const secretPath = '/stage/secret';

    mockGetParameters.mockImplementation(() => Promise.resolve(['secret 1', 'secret 2']));

    const parameterStore = makeParameterStore({ configPath, secretPath });

    return parameterStore
      .getSecrets(['SECRET_1', 'SECRET_2'])
      .then(secrets => {
        expect(secrets).toEqual(['secret 1', 'secret 2']);
        expect(mockGetParameters.mock.calls[0][0]).toEqual({
          paths: [ '/stage/secret/SECRET_1', '/stage/secret/SECRET_2' ]
        });
      });
  });

  it ('should return secret for a given key', () => {
    const configPath = '/stage/config';
    const secretPath = '/stage/secret';

    mockGetParameters.mockImplementation(() => Promise.resolve(['secret value']));

    const parameterStore = makeParameterStore({ configPath, secretPath });

    return parameterStore
      .getSecret('SOME_SECRET')
      .then(secret => {
        expect(secret).toEqual('secret value');
        expect(mockGetParameters.mock.calls[0][0]).toEqual({
          paths: [ '/stage/secret/SOME_SECRET' ]
        });
      });
  });

});
