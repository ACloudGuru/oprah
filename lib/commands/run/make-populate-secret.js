'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const get = require('lodash.get');

const { log } = require('../../utils/logger');
const { promptRequiredConfigs } = require('./prompt-required-configs');

// TODO: access using settingsService. Maybe use async?
const makePopulateSecret = ({ parameterStore }) => ({ settings, interactive }) => {
  if (!get(settings, 'secret')) {
    log(chalk.white('Skipping population of secrets in SSM...'));
    return Bluebird.resolve();
  }

  log(chalk.white('Populating secrets in SSM...'));

  const path = get(settings, 'secret.path');
  const required = get(settings, 'secret.required');

  if(!path) {
    return Bluebird.reject(new Error('Please specify ssmPath for populateSecret'));
  }

  return promptRequiredConfigs({
    parameterNames: get(settings, 'secretParameters'),
    required,
    interactive,
    parameterStore
  })
    .then((secrets => parameterStore.updateSecrets({
      path,
      secrets
    })));
};

module.exports = {
  makePopulateSecret
};
