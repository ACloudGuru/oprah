'use strict';

const Bluebird = require('bluebird');
const get = require('lodash.get');
const { readFile } = require('./fs/readFile');
const { interpolate } = require('./interpolate');
const { makeCfService } = require('../../services/cf/make-cf-service');

const deepMap = require('deep-map');

const ALLOWED_PROVIDERS = ['ssm', 'ddb']

const validateConfig = ({ config }) => {
  const provider = get(config, 'provider.name');

  if (!ALLOWED_PROVIDERS.includes(provider)) {
    return Bluebird.reject(new Error(`Provider must be provided: ${ALLOWED_PROVIDERS}`));
  }

  return Bluebird.resolve(config);
};

const mergeCfOutputs = (configFile) => {
  const cfService = makeCfService();
  return cfService.getOutputs({ stackNames: configFile.cfOutputs })
    .then(outputs => Object.assign({}, configFile, { outputs }));
};

const appendConfigParameters = settings => {
  const path = get(settings, 'config.path');
  const defaults = get(settings, 'config.defaults');
  const required = get(settings, 'config.required');
  const allParameters = Object.assign({}, defaults, required);
  const parameterNames = Object.keys(allParameters)
    .filter(Boolean)
    .map(keyName => path.concat('/', keyName));

  return Object.assign({}, settings, { configParameters: parameterNames });
}

const appendSecretParameters = settings => {
  const path = get(settings, 'secret.path');
  const required = get(settings, 'secret.required');
  const allParameters = Object.assign({}, required);
  const parameterNames = Object.keys(allParameters)
    .filter(Boolean)
    .map(keyName => path.concat('/', keyName));

  return Object.assign({}, settings, { secretParameters: parameterNames });
}

const getConfig = ({ configFile, variables }) => {
  const filePath = configFile;

  try {
    const config = readFile({ filePath });
    return validateConfig({ config })
    .then(validatedConfig => deepMap(validatedConfig, value => interpolate({ value, variables })))
    .then(mergeCfOutputs)
    .then(appendConfigParameters)
    .then(appendSecretParameters)
  } catch(error) {
    return Bluebird.reject(new Error(`Could not find oprah.yml in the following directory - ${process.cwd()}`));
  }
};

module.exports = {
  getConfig
};
