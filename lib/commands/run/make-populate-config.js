'use strict';

const Bluebird = require('bluebird');
const isEmpty = require('lodash.isempty');
const get = require('lodash.get');
const chalk = require('chalk');

const { log } = require('../../utils/logger');
const { promptRequiredConfigs } = require('./prompt-required-configs');

const makePopulateConfig =
({ parameterStore }) =>
  ({ settings, stage, interactive }) => {
    if (!get(settings, 'config')) {
      log(chalk.white('Skipping population of config in SSM...'));
      return Bluebird.resolve();
    }

    log(chalk.white('Populating configuration in SSM...'));

    const overrides = get(settings, `config.${stage}`);
    if (isEmpty(overrides)) {
      log(chalk.cyan('Could not find configuration overrides. Using default values.'));
    }

    const path = get(settings, 'config.path');
    const required = get(settings, 'config.required');
    const defaults = get(settings, 'config.defaults') || {};
    const outputs = get(settings, 'config.outputs') || {};

    if(!path) {
      return Bluebird.reject(new Error('Please specify ssmPath for populateConfig'));
    }

    return promptRequiredConfigs({
      parameterNames: get(settings, 'configParameters'),
      required,
      interactive,
      parameterStore
    })
      .then(configFromPrompt => {
        const mergedConfig = Object.assign({}, configFromPrompt, defaults, outputs, overrides);
        return parameterStore.updateConfigs({
          path,
          configs: mergedConfig
        });
      })
  };

module.exports = { makePopulateConfig };