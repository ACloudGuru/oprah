'use strict';

const chalk = require('chalk');
const get = require('lodash.get');
const fs = require('fs');

const { log } = require('../../utils/logger');

const makeExport = ({ settingsService, parameterStore }) => {
  return (filePath) => settingsService.getSettings()
  .tap(() => log(chalk.white(`Getting parameters..`)))
  .then(settings => {
    const secretsPromise = parameterStore.getParameters({
      parameterNames: get(settings, 'secretParameters')
    });

    const configsPromise = parameterStore.getParameters({
      parameterNames: get(settings, 'configParameters')
    });

    return Promise.all([ secretsPromise, configsPromise ]);
  })
  .tap(() => log(chalk.white(`Saving parameters to: ${filePath}`)))
  .then(([ secrets, configs ]) => {
    const writeOutput = {
      configs,
      secrets,
    };

    fs.writeFileSync(filePath, JSON.stringify(writeOutput, null, 2));
  });
};

module.exports = {
    makeExport,
};
