'use strict';

const mockGetParameters = jest.fn();

jest.mock('aws-sdk', () => ({
    SSM: function() {
        return { getParameters: mockGetParameters };
    }
}));

mockGetParameters.mockImplementation(() => ({
  promise: () => Promise.resolve({
    Parameters: [
      { Name: '/stage/config/CONFIG_1', Value: 'config 1' },
      { Name: '/stage/config/CONFIG_2', Value: 'config 2' },
      { Name: '/stage/secret/SECRET_1', Value: 'secret 1' },
      { Name: '/stage/secret/SECRET_2', Value: 'secret 2' },
    ]
  })
}));

describe('#ParameterStore', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it ('should return a config for a given key', () => {
    const configPath = '/stage/config';
    const secretPath = '/stage/secret';

    const { makeParameterStore } = require('../index');
    const parameterStore = makeParameterStore({ configPath, secretPath });

    return parameterStore
      .getConfig('CONFIG_1')
      .then(config => {
        expect(config).toEqual('config 1');
        expect(mockGetParameters.mock.calls[0][0]).toEqual({
          Names: [ '/stage/config/CONFIG_1' ],
          WithDecryption: true
        });
      });
  });

  it ('should return configs for a given keys', () => {
    const configPath = '/stage/config';
    const secretPath = '/stage/secret';

    const { makeParameterStore } = require('./makeParameterStore');
    const parameterStore = makeParameterStore({ configPath, secretPath });

    return parameterStore
      .getConfigs(['CONFIG_1', 'CONFIG_2'])
      .then(configs => {
        expect(configs).toEqual({ CONFIG_1: 'config 1', CONFIG_2: 'config 2' });
        expect(mockGetParameters.mock.calls[0][0]).toEqual({
          Names: [ '/stage/config/CONFIG_1', '/stage/config/CONFIG_2' ],
          WithDecryption: true
        });
      });
  });

  it ('should return secrets for a given keys', () => {
    const configPath = '/stage/config';
    const secretPath = '/stage/secret';

    const { makeParameterStore } = require('./makeParameterStore');
    const parameterStore = makeParameterStore({ configPath, secretPath });

    return parameterStore
      .getSecrets(['SECRET_1', 'SECRET_2'])
      .then(secrets => {
        expect(secrets).toEqual({ SECRET_1: 'secret 1', SECRET_2: 'secret 2' });
        expect(mockGetParameters.mock.calls[0][0]).toEqual({
          Names: [ '/stage/secret/SECRET_1', '/stage/secret/SECRET_2' ],
          WithDecryption: true
        });
      });
  });

  it ('should return secret for a given key', () => {
    const configPath = '/stage/config';
    const secretPath = '/stage/secret';

    const { makeParameterStore } = require('./makeParameterStore');
    const parameterStore = makeParameterStore({ configPath, secretPath });

    return parameterStore
      .getSecret('SECRET_1')
      .then(secret => {
        expect(secret).toEqual('secret 1');
        expect(mockGetParameters.mock.calls[0][0]).toEqual({
          Names: [ '/stage/secret/SECRET_1' ],
          WithDecryption: true
        });
      });
  });

  it('should cache the keys once retrieved from ssm', () => {
    const configPath = '/stage/config';
    const secretPath = '/stage/secret';

    const { makeParameterStore } = require('./makeParameterStore');
    const parameterStore = makeParameterStore({ configPath, secretPath });

    return Promise.all([
      parameterStore.getSecret('SECRET_1'),
      parameterStore.getConfig('CONFIG_1')
    ])
    .then(([secret, config]) => {
      expect(secret).toEqual('secret 1');
      expect(config).toEqual('config 1');

      expect(mockGetParameters.mock.calls[0][0]).toEqual({
        Names: [ '/stage/secret/SECRET_1', '/stage/config/CONFIG_1' ],
        WithDecryption: true
      });

      jest.clearAllMocks();
    })
    .then(() => parameterStore.getSecret('SECRET_1').then(secret => {
      expect(secret).toEqual('secret 1');
      expect(mockGetParameters.mock.calls[0]).toBeUndefined();

      jest.clearAllMocks();
    }))
    .then(() => parameterStore.getConfig('CONFIG_1').then(config => {
      expect(config).toEqual('config 1');
      expect(mockGetParameters.mock.calls[0]).toBeUndefined();

      jest.clearAllMocks();
    }))
    .then(() => parameterStore.getSecret('SECRET_2').then(secret => {
      expect(secret).toEqual('secret 2');

      expect(mockGetParameters.mock.calls[0][0]).toEqual({
        Names: [ '/stage/secret/SECRET_2' ],
        WithDecryption: true
      });

      jest.clearAllMocks();
    }))
    .then(() => parameterStore.getSecret('SECRET_2').then(secret => {
      expect(secret).toEqual('secret 2');
      expect(mockGetParameters.mock.calls[0]).toBeUndefined();

      jest.clearAllMocks();
    }))
    .then(() => parameterStore.getSecrets(['SECRET_1', 'SECRET_2']).then(secrets => {
      expect(secrets).toEqual({ SECRET_1: 'secret 1', SECRET_2: 'secret 2' });
      expect(mockGetParameters.mock.calls[0]).toBeUndefined();

      jest.clearAllMocks();
    }))
    .then(() => parameterStore.getConfigs(['CONFIG_1', 'CONFIG_2']).then(secrets => {
      expect(secrets).toEqual({ CONFIG_1: 'config 1', CONFIG_2: 'config 2' });

      expect(mockGetParameters.mock.calls[0][0]).toEqual({
        Names: [ '/stage/config/CONFIG_2' ],
        WithDecryption: true
      });

      jest.clearAllMocks();
    }));
  });
});





