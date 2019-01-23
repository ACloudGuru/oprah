'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const { log } = require('../utils/logger');
const get = require('lodash.get');

const getParameters = ({ parameterNames, parameterStore }) => {
  if(!parameterNames.length) {
    return Bluebird.resolve({});
  }

  return parameterStore.readRemoteConfigs({ parameterNames })
    .then(configs => Object.keys(configs)
      .sort()
      .reduce((acc, key) => {
        acc[key] = configs[key];
        return acc;
      }, {})
    );
};

const makeListConfigurations = ({ parameterStore }) => ({ parameterNames, message }) => {
  return getParameters({ parameterNames, parameterStore })
    .tap(params => {
      log(chalk.cyan(message));

      Object.keys(params)
        .map(key => console.log(chalk.gray(`  ${key}: ${params[key]}`)));

      return params;
    });
};

const makeList = ({ getSettings, parameterStore }) => {
  const listConfigurations = makeListConfigurations({ parameterStore });

    return () => getSettings()
    .tap(() => log(chalk.white(`Listing all configurations..`)))
    .tap(settings => {
      return listConfigurations({
        parameterNames: get(settings, 'configParameters'),
        message: 'Configs:'
      })
    })
    .tap(settings => {
      return listConfigurations({
        parameterNames: get(settings, 'secretParameters'),
        message: 'Secrets:'
      });
    })
}

module.exports = {
  makeList
};
