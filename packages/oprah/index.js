'use strict';

const { oprah } = require('./lib/oprah');
const { validateArguments } = require('./lib/validate-arguments');
const { populateConfig } = require('./lib/populate-config');
const { populateSecret } = require('./lib/populate-secret');
const { readCfOutputs } = require('./lib/read-cf-outputs');


module.exports = {
  oprah,
  validateArguments,
  populateConfig,
  populateSecret,
  readCfOutputs
};
