'use strict';

// TODO: this file needs a lot of tests

const Bluebird = require('bluebird');

const { promptForValues } = require('./prompt-for-values');
const { logWarning } = require('../../utils/logger');

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

const makePromptRequiredConfigs = ({ parameterStore }) => ({ parameterNames, required, interactive }) => {
  return parameterStore.getParameters({ parameterNames })
    .then(currentConfigs => {
      if (interactive !== true) {
        return getAllExistingConfigs(required, currentConfigs);
      }

      return promptForValues({
        requiredValues: required,
        currentValues: currentConfigs
      });
    });
};

module.exports = { makePromptRequiredConfigs };
