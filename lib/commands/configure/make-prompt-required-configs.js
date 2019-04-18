'use strict';

// TODO: this file needs a lot of tests

const { promptForValues } = require('./prompt-for-values');
const { validateExistingValues } = require('./validate-existing-values');

const makePromptRequiredConfigs = ({ parameterStore }) => ({ parameterNames, required, interactive }) => {
  return parameterStore.getParameters({ parameterNames })
    .then(currentValues => {
      if (!interactive) {
        return validateExistingValues({
          requiredValues: required,
          currentValues
        });
      }

      return promptForValues({
        requiredValues: required,
        currentValues
      });
    });
};

module.exports = { makePromptRequiredConfigs };
