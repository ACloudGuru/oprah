'use strict';

const Bluebird = require('bluebird');
const isEmpty = require('lodash.isempty');
const get = require('lodash.get');
const chalk = require('chalk');

const { log } = require('../../utils/logger');
const { promptRequiredConfigs } = require('./prompt-required-configs');

const populateConfig = ({ settings, config, overrides, interactive, parameterStore }) => {
  log(chalk.white('Populating configuration in SSM...'));

  if (isEmpty(overrides)) {
    log(chalk.cyan('Could not find configuration overrides. Using default values.'));
  }

  const { path, defaults, required } = config;

  if(!path) {
    return Bluebird.reject(new Error('Please specify ssmPath for populateConfig'));
  }

  return promptRequiredConfigs({
    parameterNames: get(settings, 'configParameters'),
    required,
    interactive,
    parameterStore
  })
    .then(config => Object.assign(config, defaults, overrides))
    .then(configs => parameterStore.updateConfigs({ path, configs }));
};

module.exports = { populateConfig };
