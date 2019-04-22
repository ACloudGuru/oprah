const chalk = require('chalk');
const { makePopulateConfig } = require('./make-populate-config');
const { makePopulateSecret } = require('./make-populate-secret');
const { makePromptRequiredConfigs } = require('./make-prompt-required-configs');

const { log } = require('../../../lib/utils/logger');

const makeConfigure = ({ stage, interactive, settingsService, parameterStore }) => () => {
  log(chalk.cyan(`Running Oprah in ${interactive ? 'interactive' : 'non-interactive'} mode..`));

  const promptRequiredConfigs = makePromptRequiredConfigs({ parameterStore });
  const populateConfig = makePopulateConfig({ parameterStore, promptRequiredConfigs });
  const populateSecret = makePopulateSecret({ parameterStore, promptRequiredConfigs});

  return settingsService.getSettings()
  .tap((settings) => {
    return populateConfig({
      settings,
      stage,
      interactive
    });
  })
  .then(settings => {
    return populateSecret({
      settings,
      interactive
    });
  });
};

module.exports = {
  makeConfigure
};
