'use strict';

const chalk = require('chalk');
const get = require('lodash.get');

const { log } = require('../../utils/logger');

const listParameters = parameters => {
  Object.keys(parameters)
    .map(key => console.log(chalk.gray(`  ${key}: ${parameters[key]}`)));

  return parameters;
}

const makeList = ({ getSettings, parameterStore }) => {
    return () => getSettings()
    .tap(() => log(chalk.white(`Listing all configurations..`)))
    .tap(settings => {
      log(chalk.cyan('Configs:'));

      return parameterStore.getParameters({
        parameterNames: get(settings, 'configParameters')
      })
      .then(listParameters)
    })
    .tap(settings => {
      log(chalk.cyan('Secrets:'));

      return parameterStore.getParameters({
        parameterNames: get(settings, 'secretParameters')
      })
      .then(listParameters)
    })
}

module.exports = {
  makeList
};
