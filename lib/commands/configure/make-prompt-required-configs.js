'use strict';

// TODO: this file needs a lot of tests
const get = require('lodash.get');
const { promptForValues } = require('./prompt-for-values');
const { validateExistingValues } = require('./validate-existing-values');

const makePromptRequiredConfigs = ({ parameterStore }) => ({ parameterNames, required, interactive, missingOnly }) => {
  return parameterStore.getParameters({ parameterNames })
    .then(currentValues => {
      if (!interactive) {
        return validateExistingValues({
          requiredValues: required,
          currentValues
        });
      }

      if (missingOnly) {
        const missingValues = Object.keys(required)
          .reduce((acc, key) => {
            if (!get(currentValues, key)) {
              return Object.assign(
                {},
                acc,
                {
                  [key]: get(required, key)
                }
              );
            }

            return acc;
          }, {});

        return promptForValues({
          requiredValues: missingValues,
          currentValues: {}
        })
      }

      return promptForValues({
        requiredValues: required,
        currentValues
      });
    });
};

module.exports = { makePromptRequiredConfigs };
