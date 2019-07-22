'use strict';

// TODO: this file needs a lot of tests
const get = require('lodash.get');
const { promptForValues } = require('./prompt-for-values');
const { validateExistingValues } = require('./validate-existing-values');

const makePromptRequiredConfigs = ({ parameterStore }) => ({ parameterNames, required, interactive, missingOnly }) => {
  const normalizedRequired = required || {};

  return parameterStore.getParameters({ parameterNames })
    .then(currentValues => {
      if (!interactive) {
        return validateExistingValues({
          requiredValues: normalizedRequired,
          currentValues
        });
      }

      if (missingOnly) {
        const missingValues = Object.keys(normalizedRequired)
          .reduce((acc, key) => {
            if (!get(currentValues, key)) {
              return Object.assign(
                {},
                acc,
                {
                  [key]: get(normalizedRequired, key)
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
        requiredValues: normalizedRequired,
        currentValues
      });
    });
};

module.exports = { makePromptRequiredConfigs };
