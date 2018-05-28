'use strict';

const makeSsmEnvReader = require('./lib/makeSsmEnvReader');

module.exports = {
  ssmEnvReader: makeSsmEnvReader({
    env: process.env,
    getCurrentDate: () => new Date().toISOString()
  })
};
