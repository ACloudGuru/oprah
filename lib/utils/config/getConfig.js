'use strict';

const Bluebird = require('bluebird');
const get = require('lodash.get');
const { readFile } = require('../fs/readFile');
const { interpolate } = require('./interpolate');

const deepMap = require('deep-map');

const ALLOWED_PROVIDERS = ['ssm', 'ddb']

const validateConfig = ({ config }) => {
  const provider = get(config, 'provider.name');

  if (!ALLOWED_PROVIDERS.includes(provider)) {
    return Bluebird.reject(new Error(`Provider must be provided: ${ALLOWED_PROVIDERS}`));
  }

  if (provider === 'ddb' && !get(config, 'provider.tableName')) {
    return Bluebird.reject(new Error(`ddb provider requires provider.tableName`));
  }

  return Bluebird.resolve(config);
}

const getConfig = ({ configFile, variables }) => {
  const filePath = configFile;

  try {
    const config = readFile({ filePath });

    return validateConfig({ config })
    .then(() => Bluebird.resolve(deepMap(config, value => interpolate({ value, variables }))));
  } catch(error) {
    return Bluebird.reject(new Error(`Could not find oprah.yml in the following directory - ${process.cwd()}`));
  }
};

module.exports = { getConfig };
