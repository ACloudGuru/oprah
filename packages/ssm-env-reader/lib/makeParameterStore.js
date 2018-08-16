'use strict';

const { getParameters } = require('./getParameters');

const makeParameterStore = ({ configPath, secretPath }) => {

  const getSingleParameter = (path, key) => {
    return getParameters({ paths: [`${path}/${key}`] }).then(([ result ]) => result);
  };

  const getMultipleParameters = (path, keys) => {
    const paths = keys.map(key => `${path}/${key}`);
    return getParameters({ paths });
  };

  const getConfig = key => getSingleParameter(configPath, key);
  const getConfigs = keys => getMultipleParameters(configPath, keys);

  const getSecret = key => getSingleParameter(secretPath, key);
  const getSecrets = keys => getMultipleParameters(secretPath, keys);

  return {
    getConfig,
    getSecret,
    getConfigs,
    getSecrets
  };
};

module.exports = { makeParameterStore };
