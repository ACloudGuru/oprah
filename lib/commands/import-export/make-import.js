'use strict';

const chalk = require('chalk');
const get = require('lodash.get');
const fs = require('fs');
const mapKeys = require('lodash.mapkeys');

const { log } = require('../../utils/logger')

const configurationImport = (parameterStore, settings, importedConfig) => {
    const path = get(settings, 'config.path')

    const configurationParameters = mapKeys(importedConfig, (_, key) => {
      return `${path}/${key}`;
    });

    return parameterStore.updateConfigs({
      parameters: configurationParameters
    });
};

const secretImport = (parameterStore, settings, importedSecrets) => {
    const path = get(settings, 'secret.path');

    const secretParameters = mapKeys(importedSecrets, (_, key) => {
      return `${path}/${key}`;
    });

    return parameterStore.updateSecrets({
      parameters: secretParameters
    });
};

const makeImport = ({ settingsService, parameterStore }) => {
    return (filePath) => settingsService.getSettings()
    .tap(() => log(chalk.white(`Getting parameters from: ${filePath}`)))
    .then(settings => {
        const importedExport = JSON.parse(fs.readFileSync(filePath));

        return { settings, importedExport };
    })
    .then(({ settings, importedExport }) => {
      const importedConfig = get(importedExport, 'configs', {});
      const importedSecrets =  get(importedExport, 'secrets', {});

      return Promise.all([
        configurationImport(parameterStore, settings, importedConfig),
        secretImport(parameterStore, settings, importedSecrets),
      ]);
    })
    .tap(() => log(chalk.white(`Saved parameters to provider`)))
};

module.exports = {
    makeImport,
};
