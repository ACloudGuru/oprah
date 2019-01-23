'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const get = require('lodash.get');

const { log } = require('../../utils/logger');
const { promptRequiredConfigs } = require('./prompt-required-configs');

const makePopulateSecret = ({ parameterStore }) => ({ settings, secret, interactive }) => {
  log(chalk.white('Populating secrets in SSM...'));

  const { path, required } = secret;

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
