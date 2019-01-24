'use strict';

const Bluebird = require('bluebird');
const get = require('lodash.get');
const { readFile } = require('./fs/readFile');
const { interpolate } = require('./interpolate');
const { getValidatedSettings } = require('./get-validated-settings');

const deepMap = require('deep-map');

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
    return Bluebird.resolve()
      .then(() => readFile({ filePath: settingsFilePath }))
      .catch(() => {
        throw new Error(`Could not find oprah.yml in the following directory - ${process.cwd()}`);
      })
      .then(config => getValidatedSettings({ config }))
      .then(validatedConfig => deepMap(validatedConfig, value => interpolate({ value, variables })))
      .then(appendCfOutputs)
      .then(appendConfigParameters)
      .then(appendSecretParameters);
    };


module.exports = {
  makeGetSettings
};
