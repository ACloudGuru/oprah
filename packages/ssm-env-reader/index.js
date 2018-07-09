'use strict';

const makeSsmEnvReader = require('./lib/makeSsmEnvReader');
const validateKeys = require('./lib/validateKeys');

module.exports = {
  ssmEnvReader: makeSsmEnvReader({
    env: process.env,
    cacheDuration: 60000,
    getCurrentDate: () => new Date().toISOString()
  }),
  validateKeys: validateKeys
};
