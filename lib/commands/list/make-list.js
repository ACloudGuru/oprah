const chalk = require('chalk');
const get = require('lodash/get');

const { log } = require('../../utils/logger');
const { listParameters } = require('./list-parameters');

const makeList = ({ settingsService, parameterStore }) => async () => {
  const settings = await settingsService.getSettings();
  log(chalk.white(`Listing all configurations..`));

  log(chalk.cyan('Configs:'));
  await parameterStore
    .getParameters({
      parameterNames: get(settings, 'configParameters')
    })
    .then(parameters => listParameters({ parameters }));

  log(chalk.cyan('Secrets:'));
  await parameterStore
    .getParameters({
      parameterNames: get(settings, 'secretParameters')
    })
    .then(parameters =>
      listParameters({
        parameters,
        mask: true
      })
    );
};

module.exports = {
  makeList
};
