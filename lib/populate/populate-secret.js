'use strict';

const Bluebird = require('bluebird');

const { generateSecretUpdaters } = require('../secret-store');
const { promptRequiredConfigs } = require('../prompt-required-configs');
const { logInfo } = require('../utils/logger');

const populateSecret = ({ secret, interactive }) => {
  logInfo('Populating secrets in SSM...');

  const { path, keyId, required } = secret;

  if(!path) {
    return Bluebird.reject(new Error('Please specify ssmPath for populateSecret'));
  }

  return promptRequiredConfigs({ path, required, interactive })
    .then(secrets => {
      const updaters = generateSecretUpdaters({ secrets, path, keyId });

      return Bluebird.mapSeries(updaters, updater => updater().delay(500));
    });
};

module.exports = {
  populateSecret
};
