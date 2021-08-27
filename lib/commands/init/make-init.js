const get = require('lodash/get');
const chalk = require('chalk');
const { log } = require('../../utils/logger');

// TODO: create helper method on settings service to validate provider
const makeInit = ({ settingsService }) => {
  const initSsm = () => Promise.resolve();

  return async () => {
    const settings = await settingsService.getSettings();

    const providerName = get(settings, 'provider.name');

    if (providerName === 'ddb') {
      log(chalk.red(`provider no longer supported, use only SSM!`));
      Promise.reject();
    }

    return initSsm();
  };
};

module.exports = {
  makeInit
};
