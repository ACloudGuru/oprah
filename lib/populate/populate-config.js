'use strict';

const Bluebird = require('bluebird');

const { generateConfigUpdaters } = require('../secret-store');
const { promptRequiredConfigs } = require('../prompt-required-configs');
const isEmpty = require('lodash.isempty');

const chalk = require('chalk');
const { log } = require('../utils/logger');

const populateConfig = ({ config, overrides, interactive }) => {
  log(chalk.white('Populating configuration in SSM...'));

  if (isEmpty(overrides)) {
    log(chalk.cyan('Could not find configuration overrides. Using default values.'));
  }

  const { path, defaults, required } = config;

  if(!path) {
    return Bluebird.reject(new Error('Please specify ssmPath for populateConfig'));
  }

  const mergedConfig = Object.assign({}, defaults, overrides);

  return promptRequiredConfigs({ path, required, interactive })
  .then(config => Object.assign(config, mergedConfig))
  .then(config => {
    const updaters = generateConfigUpdaters({ config, path });

    return Bluebird.mapSeries(updaters, updater => updater().delay(500));
  });
};

module.exports = { populateConfig };
