'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const { log } = require('../utils/logger');
const get = require('lodash.get');

const getParameters = ({ path, parameterStore }) => {
  if(!path) {
    return Bluebird.resolve({});
  }

  return parameterStore.readRemoteConfigs({ path })
    .then(configs => Object.keys(configs)
      .sort()
      .reduce((acc, key) => {
        acc[key] = configs[key];
        return acc;
      }, {})
    );
};

const makeListConfigurations = ({ parameterStore }) => ({ path, message }) => {
  return getParameters({ path, parameterStore })
    .tap(params => {
      log(chalk.cyan(message));

      Object.keys(params)
        .map(key => console.log(chalk.gray(`  ${key}: ${params[key]}`)));

      return params;
    });
};

const makeList = ({ getSettings, parameterStore }) => {
  const listConfigurations = makeListConfigurations({ parameterStore });

  log(chalk.white(`Listing all configurations..`));
  return () => getSettings()
    .tap(settings => {
      return listConfigurations({
        path: get(settings, 'config.path'),
        message: 'Configs:'
      })
    })
    .tap(settings => {
      return listConfigurations({
        path: get(settings, 'secret.path'),
        message: 'Secrets:'
      });
    })
}

module.exports = {
  makeList
};