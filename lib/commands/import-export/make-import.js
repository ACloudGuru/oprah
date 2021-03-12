const chalk = require('chalk');
const get = require('lodash.get');
const fs = require('fs');
const mapKeys = require('lodash.mapkeys');

const { log } = require('../../utils/logger');

const configurationImport = (parameterStore, settings, importedConfig) => {
  const path = get(settings, 'config.path');

  const configurationParameters = mapKeys(
    importedConfig,
    (_, key) => `${path}/${key}`
  );

  return parameterStore.updateConfigs({
    parameters: configurationParameters
  });
};

const secretImport = (parameterStore, settings, importedSecrets) => {
  const path = get(settings, 'secret.path');

  const secretParameters = mapKeys(
    importedSecrets,
    (_, key) => `${path}/${key}`
  );

  return parameterStore.updateSecrets({
    parameters: secretParameters
  });
};

const makeImport = ({ settingsService, parameterStore }) => async filePath => {
  const settings = await settingsService.getSettings();

  log(chalk.white(`Getting parameters from: ${filePath}`));

  const importedExport = JSON.parse(fs.readFileSync(filePath));

  const importedConfig = get(importedExport, 'configs', {});
  const importedSecrets = get(importedExport, 'secrets', {});

  const result = Promise.all([
    configurationImport(parameterStore, settings, importedConfig),
    secretImport(parameterStore, settings, importedSecrets)
  ]);

  log(chalk.white(`Saved parameters to provider`));

  return result;
};

module.exports = {
  makeImport
};
