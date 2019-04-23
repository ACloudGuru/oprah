'use strict';

const Bluebird = require('bluebird');
const isEmpty = require('lodash.isempty');
const get = require('lodash.get');
const mapKeys = require('lodash.mapkeys');
const chalk = require('chalk');

const { log } = require('../../utils/logger');

const makePopulateConfig =
({ parameterStore, promptRequiredConfigs }) =>
  ({ settings, stage, interactive, missingOnly }) => {
    if (!get(settings, 'config')) {
      log(chalk.white('Skipping population of config...'));
      return Bluebird.resolve();
    }

    log(chalk.white('Populating configuration...'));

    const overrides = get(settings, `config.${stage}`);
    if (isEmpty(overrides)) {
      log(chalk.cyan('Could not find configuration overrides. Using default values.'));
    }

    const path = get(settings, 'config.path');
    const required = get(settings, 'config.required');
    const defaults = get(settings, 'config.defaults') || {};
    const outputs = get(settings, 'outputs') || {};

    if(!path) {
      return Bluebird.reject(new Error('Please specify ssmPath for populateConfig'));
    }

    return promptRequiredConfigs({
      parameterNames: get(settings, 'configParameters'),
      required,
      interactive,
      missingOnly
    })
      .then(configFromPrompt => {
        const mergedConfig = Object.assign({}, configFromPrompt, defaults, outputs, overrides);
        const parameters = mapKeys(mergedConfig, (_, key) => {
          return `${path}/${key}`;
        });

        return parameterStore.updateConfigs({
          parameters
        });
      })
  };

module.exports = { makePopulateConfig };
