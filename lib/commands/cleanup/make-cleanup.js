const { get, property, isEmpty } = require('lodash');
const chalk = require('chalk');
const { log } = require('../../utils/logger');

const maskValue = value => value.replace(/\S(?=\S{4})/g, '*');

const makeCleanup = ({ parameterStore, settingsService }) => async (
  { dryRun } = { dryRun: false }
) => {
  const settings = await settingsService.getSettings();
  const configPath = get(settings, 'config.path');
  const secretPath = get(settings, 'secret.path');
  const parameters = await Promise.all([
    parameterStore.getAllParameters({ path: configPath }),
    parameterStore.getAllParameters({ path: secretPath })
  ]).then(([configs, secrets]) => [...configs, ...secrets]);

  const { configParameters = [], secretParameters = [] } = settings;
  const unusedParameters = parameters.filter(
    ({ Name }) => ![...configParameters, ...secretParameters].includes(Name)
  );

  if (isEmpty(unusedParameters)) {
    log(chalk.gray('Cleanup --> No unused parameters'));
    return Promise.resolve();
  }

  if (dryRun) {
    log(chalk.gray('Cleanup --> Parameters to be deleted: '));
    return unusedParameters.map(({ Name, Value, Type }) => {
      const shouldMask = Type === 'SecureString';
      return log(
        chalk.gray(
          `Cleanup --> Name: ${Name} | Value: [${
            shouldMask ? maskValue(Value) : Value
          }]`
        )
      );
    });
  }

  return parameterStore.deleteParameters({
    parameterNames: unusedParameters.map(property('Name'))
  });
};

module.exports = { makeCleanup };
