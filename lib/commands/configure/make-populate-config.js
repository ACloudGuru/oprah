const isEmpty = require('lodash.isempty');
const get = require('lodash.get');
const chalk = require('chalk');

const { log } = require('../../utils/logger');

const makePopulateConfig = ({ parameterStore, promptRequiredConfigs }) => ({
  settings,
  stage,
  interactive,
  missingOnly
}) => {
  if (!get(settings, 'config')) {
    log(chalk.white('Skipping population of config...'));
    return Promise.resolve();
  }

  log(chalk.white('Populating configuration...'));

  const overrides = get(settings, `config.${stage}`);
  if (isEmpty(overrides)) {
    log(
      chalk.cyan(
        'Could not find configuration overrides. Using default values.'
      )
    );
  }

  const path = get(settings, 'config.path');
  const required = get(settings, 'config.required');
  const defaults = get(settings, 'config.defaults') || {};
  const outputs = get(settings, 'outputs') || {};

  if (!path) {
    return Promise.reject(
      new Error('Please specify ssmPath for populateConfig')
    );
  }

  return promptRequiredConfigs({
    parameterNames: get(settings, 'configParameters'),
    required,
    interactive,
    missingOnly
  }).then(configFromPrompt => {
    const mergedConfig = {
      ...configFromPrompt,
      ...defaults,
      ...outputs,
      ...overrides
    };

    const parameters = Object.entries(mergedConfig)
      .map(([key, value]) => ({
        [`${path}/${key}`]: value
      }))
      .reduce((accum, value) => ({ ...accum, ...value }));

    return parameterStore.updateConfigs({
      parameters
    });
  });
};

module.exports = { makePopulateConfig };
