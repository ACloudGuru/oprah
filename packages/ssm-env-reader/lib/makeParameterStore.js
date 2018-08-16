'use strict';

const { getParameters } = require('./getParameters');

const makeParameterStore = ({ configPath, secretPath }) => {

  const getSingleParameter = (path, key) => {
    return getParameters({ paths: [`${path}/${key}`] }).then(([ result ]) => result);
  };

  const getMultipleParameters = (path, keys) => {
    const paths = keys.map(key => `${path}/${key}`);

    return getParameters({ paths }).then(parameters => {
      return parameters.reduce(
        (acc, parameter, index) => Object.assign({}, acc, { [keys[index]]: parameter }),
        {}
      );
    });
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
