const chalk = require('chalk');
const get = require('lodash.get');
const fs = require('fs');

const { log } = require('../../utils/logger');

const makeExport = ({ settingsService, parameterStore }) => async (filePath, target) => {
  const settings = await settingsService.getSettings();

  log(chalk.white(`Getting parameters..`));

  const secretsPromise = parameterStore.getParameters({
    parameterNames: get(settings, 'secretParameters')
  });

  const configsPromise = parameterStore.getParameters({
    parameterNames: get(settings, 'configParameters')
  });

  const [secrets, configs] = await Promise.all([
    secretsPromise,
    configsPromise
  ]);

  log(chalk.white(`Saving parameters to: ${filePath}`));

  return fs.writeFileSync(
    filePath,
    target === 'env'
      ? Object.entries({ ...configs, ...secrets }).map(([key, val]) => `${key}="${val}"`).join("\n") + "\n"
      : JSON.stringify({ configs, secrets }, null, 2)
  );
};

module.exports = {
  makeExport
};
