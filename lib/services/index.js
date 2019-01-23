'use strict';

const { populateConfig } = require('./populate-config');
const { populateSecret } = require('./populate-secret');
const { listConfigs, listSecrets } = require('./list-config');

module.exports = {
  populateConfig,
  populateSecret,
  listConfigs,
  listSecrets
};
