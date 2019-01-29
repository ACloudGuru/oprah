'use strict';

const chalk = require('chalk');
const get = require('lodash.get');

const { log } = require('../../utils/logger');
const { listParameters } = require('./list-parameters');

const makeList = ({ settingsService, parameterStore }) => {
    return () => settingsService.getSettings()
    .tap(() => log(chalk.white(`Listing all configurations..`)))
    .tap(settings => {
      log(chalk.cyan('Configs:'));

      return parameterStore.getParameters({
        parameterNames: get(settings, 'configParameters')
      })
      .then(parameters => listParameters({ parameters }))
    })
    .tap(settings => {
      log(chalk.cyan('Secrets:'));

      return parameterStore.getParameters({
        parameterNames: get(settings, 'secretParameters')
      })
      .then(parameters => listParameters({
        parameters,
        mask: true
      }))
    })
}

module.exports = {
  makeList
};
