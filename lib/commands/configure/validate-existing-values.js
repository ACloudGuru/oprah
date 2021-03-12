const { logWarning } = require('../../utils/logger');

const validateExistingValues = async ({ requiredValues, currentValues }) => {
  if (!requiredValues) {
    return {};
  }

  const configs = Object.keys(requiredValues)
    .filter(key => {
      if (!currentValues[key]) {
        logWarning(`Config missing: [${key}: ${requiredValues[key]}]`);
      }

      return currentValues[key];
    })
    .reduce((accum, key) => {
      /* eslint-disable-next-line */
      accum[key] = currentValues[key];
      return accum;
    }, {});

  const hasMissingConfigs =
    Object.keys(configs).length !== Object.keys(requiredValues).length;

  if (hasMissingConfigs) {
    throw new Error(
      'Missing required configs!! Run on interactive mode to populate them!!'
    );
  }

  return configs;
};

module.exports = {
  validateExistingValues
};
