const chalk = require('chalk');
const get = require('lodash.get');

const { log } = require('../../utils/logger');

// TODO: access using settingsService. Maybe use async?
const makePopulateSecret = ({
  parameterStore,
  promptRequiredConfigs
}) => async ({ settings, interactive, missingOnly }) => {
  if (!get(settings, 'secret')) {
    log(chalk.white('Skipping population of secrets...'));
    return '';
  }

  log(chalk.white('Populating secrets...'));

  const path = get(settings, 'secret.path');
  const required = get(settings, 'secret.required');

  if (!path) {
    throw new Error('Please specify ssmPath for populateSecret');
  }

  const secrets = await promptRequiredConfigs({
    parameterNames: get(settings, 'secretParameters'),
    required,
    interactive,
    missingOnly
  });

  const parameters = Object.entries(secrets)
    .map(([key, value]) => ({
      [`${path}/${key}`]: value
    }))
    .reduce((accum, value) => ({ ...accum, ...value }));

  return parameterStore.updateSecrets({ parameters });
};

module.exports = {
  makePopulateSecret
};
