'use strict';

const Bluebird = require('bluebird');
const get = require('lodash.get');
const { readFile } = require('./fs/readFile');
const { interpolate } = require('./interpolate');

const deepMap = require('deep-map');

const ALLOWED_PROVIDERS = ['ssm', 'ddb']

const validateConfig = ({ config }) => {
  const provider = get(config, 'provider.name');

  if (!ALLOWED_PROVIDERS.includes(provider)) {
    return Bluebird.reject(new Error(`Provider must be provided: ${ALLOWED_PROVIDERS}`));
  }

  return Bluebird.resolve(config);
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

const makeGetSettings = ({
  settingsFilePath,
  variables,
  appendCfOutputs
}) =>
  () => {
    try {
      const config = readFile({ filePath: settingsFilePath });
      return validateConfig({ config })
      .then(validatedConfig => deepMap(validatedConfig, value => interpolate({ value, variables })))
      .then(appendCfOutputs)
      .then(appendConfigParameters)
      .then(appendSecretParameters)
    } catch(error) {
      return Bluebird.reject(new Error(`Could not find oprah.yml in the following directory - ${process.cwd()}`));
    }
  }



module.exports = {
  makeGetSettings
};
