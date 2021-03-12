const chalk = require('chalk');
const { makePopulateConfig } = require('./make-populate-config');
const { makePopulateSecret } = require('./make-populate-secret');
const { makePromptRequiredConfigs } = require('./make-prompt-required-configs');

const { log } = require('../../utils/logger');

const makeConfigure = ({
  stage,
  interactive,
  missingOnly,
  settingsService,
  parameterStore
}) => () => {
  log(
    chalk.cyan(
      `Running Oprah in ${
        interactive ? 'interactive' : 'non-interactive'
      } mode..`
    )
  );

  const promptRequiredConfigs = makePromptRequiredConfigs({ parameterStore });
  const populateConfig = makePopulateConfig({
    parameterStore,
    promptRequiredConfigs
  });
  const populateSecret = makePopulateSecret({
    parameterStore,
    promptRequiredConfigs
  });

  return settingsService
    .getSettings()
    .tap(settings =>
      populateConfig({
        settings,
        stage,
        interactive,
        missingOnly
      })
    )
    .then(settings =>
      populateSecret({
        settings,
        interactive,
        missingOnly
      })
    );
};

module.exports = {
  makeConfigure
};
