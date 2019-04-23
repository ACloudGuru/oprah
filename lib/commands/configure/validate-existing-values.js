const Bluebird = require('bluebird');
const { logWarning } = require('../../utils/logger');

const validateExistingValues = ({ requiredValues, currentValues }) => {
  if (!requiredValues) {
    return Bluebird.resolve({});
  }

  const configs = Object.keys(requiredValues)
    .filter((key) => {
      if (!currentValues[key]) {
        logWarning(`Config missing: [${key}: ${requiredValues[key]}]`);
      }

      return currentValues[key];
    })
    .reduce((configs, key) => {
      configs[key] = currentValues[key];
      return configs;
    }, {});

  const hasMissingConfigs = Object.keys(configs).length !== Object.keys(requiredValues).length;

  if (hasMissingConfigs) {
    return Bluebird.reject(new Error('Missing required configs!! Run on interactive mode to populate them!!'));
  }

  return Bluebird.resolve(configs);
};

module.exports = {
  validateExistingValues
};
