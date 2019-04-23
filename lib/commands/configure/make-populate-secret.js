'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const get = require('lodash.get');
const mapKeys = require('lodash.mapkeys');

const { log } = require('../../utils/logger');

// TODO: access using settingsService. Maybe use async?
const makePopulateSecret = ({ parameterStore, promptRequiredConfigs }) => ({ settings, interactive, missingOnly }) => {
  if (!get(settings, 'secret')) {
    log(chalk.white('Skipping population of secrets...'));
    return Bluebird.resolve();
  }

  log(chalk.white('Populating secrets...'));

  const path = get(settings, 'secret.path');
  const required = get(settings, 'secret.required');

  if(!path) {
    return Bluebird.reject(new Error('Please specify ssmPath for populateSecret'));
  }

  return promptRequiredConfigs({
    parameterNames: get(settings, 'secretParameters'),
    required,
    interactive,
    missingOnly
  })
    .then(secrets => {
      const parameters = mapKeys(secrets, (_, key) => {
        return `${path}/${key}`;
      });
      return parameterStore.updateSecrets({
        parameters
      })
    });
};

module.exports = {
  makePopulateSecret
};
