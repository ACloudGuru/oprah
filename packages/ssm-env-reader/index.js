'use strict';

const makeSsmEnvReader = require('./lib/makeSsmEnvReader');
const validateKeys = require('./lib/validateKeys');
const { getParameters } = require('./lib/getParameters');
const { makeParameterStore } = require('./lib/makeParameterStore');

module.exports = {
  ssmEnvReader: makeSsmEnvReader({
    env: process.env,
    cacheDuration: 60000,
    getCurrentDate: () => new Date().toISOString()
  }),
  validateKeys: validateKeys,
  getParameters,
  makeParameterStore
};
