'use strict';

const makeSsmEnvReader = require('./lib/makeSsmEnvReader');

module.exports = {
  ssmEnvReader: makeSsmEnvReader({
    env: process.env,
    cacheDuration: 60000,
    getCurrentDate: () => new Date().toISOString()
  })
};
