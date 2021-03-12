const get = require('lodash.get');
const deepMap = require('deep-map');
const { readFile } = require('./fs/readFile');
const { interpolate } = require('./interpolate');
const { getValidatedSettings } = require('./get-validated-settings');
const { getAccountId } = require('./get-account-id');
const { getRegion } = require('./get-region');
const { getOutputs } = require('../cf/get-outputs');

const appendConfigParameters = settings => {
  const path = get(settings, 'config.path');
  const defaults = get(settings, 'config.defaults');
  const required = get(settings, 'config.required');
  const allParameters = { ...defaults, ...required };
  const parameterNames = Object.keys(allParameters)
    .filter(Boolean)
    .map(keyName => path.concat('/', keyName));

  return { ...settings, configParameters: parameterNames };
};

const appendSecretParameters = settings => {
  const path = get(settings, 'secret.path');
  const required = get(settings, 'secret.required');
  const allParameters = { ...required };
  const parameterNames = Object.keys(allParameters)
    .filter(Boolean)
    .map(keyName => path.concat('/', keyName));

  return { ...settings, secretParameters: parameterNames };
};

const makeGetSettings = ({
  settingsFilePath,
  variables,
  appendCfOutputs
}) => () =>
  Promise.resolve()
    .then(() => readFile({ filePath: settingsFilePath }))
    .catch(() => {
      throw new Error(
        `Could not find oprah.yml in the following directory - ${process.cwd()}`
      );
    })
    .then(config =>
      Promise.all([
        getValidatedSettings({ config }),
        getAccountId(),
        getRegion(),
        getOutputs({
          stackNames: get(config, 'stacks', []).map(stack =>
            interpolate({ value: stack, variables })
          )
        })
      ])
    )
    .then(([validatedConfig, accountId, region, cfOutputs]) => {
      const mergedVariables = { ...variables, ...cfOutputs, accountId, region };

      return deepMap(validatedConfig, value =>
        interpolate({ value, variables: mergedVariables })
      );
    })
    .then(appendCfOutputs)
    .then(appendConfigParameters)
    .then(appendSecretParameters);

module.exports = {
  makeGetSettings
};
