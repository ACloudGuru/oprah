'use strict';

const Bluebird = require('bluebird');
const map = require('lodash.map');
const get = require('lodash.get');
const chalk = require('chalk');
const prompt = Bluebird.promisifyAll(require('prompt'));
const { readRemoteConfigs } = require('../lib/secret-store');

const { logInfo, logWarning } = require('./utils/logger');

const getAllExistingConfigs = (requiredConfigs, currentConfigs) => {
  if (!requiredConfigs) {
    return Bluebird.resolve({});
  }

  const configs = Object.keys(requiredConfigs)
    .filter((key) => {
      if (!currentConfigs[key]) {
        logWarning(`Config missing: [${key}: ${requiredConfigs[key]}]`);
      }

      return currentConfigs[key];
    })
    .reduce((configs, key) => {
      configs[key] = currentConfigs[key];
      return configs;
    }, {});

  const hasMissingConfigs = Object.keys(configs).length !== Object.keys(requiredConfigs).length;

  if (hasMissingConfigs) {
    const error = 'Missing required configs!! Run on interactive mode to populate them!!';
    return Bluebird.reject(new Error(error));
  }

  return Bluebird.resolve(configs);
};

const promptRequiredConfigs = ({ path, required, interactive }) => {

  return readRemoteConfigs({ path })
    .then(currentConfigs => {
      if (interactive !== true) {
        logInfo('Running on non interactive mode..');
        return getAllExistingConfigs(required, currentConfigs);
      }

      prompt.message = '';
      prompt.delimiter = '';
      prompt.start();

      const schema = map(required, (value, key) => {
        const existingValue = get(currentConfigs, key) || '';
        return {
          name: key,
          description: `Description: ${value}\n${chalk.green(key)}:`,
          default: existingValue,
          type: 'string',
          required: true
        };
      });

      return prompt.getAsync(schema);
    });
};

module.exports = { promptRequiredConfigs };
