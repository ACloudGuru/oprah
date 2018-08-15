'use strict';

const { getParameters } = require('./getParameters');

const makeParameterStore = ({ configPath, secretPath }) => {

  const getSingleParameter = (path, key) => {
    return getParameters({ paths: [`${path}/${key}`] }).then(([ result ]) => result);
  };

  const getConfig = key => getSingleParameter(configPath, key);
  const getSecret = key => getSingleParameter(secretPath, key);

  return { getConfig, getSecret };
};

module.exports = { makeParameterStore };
