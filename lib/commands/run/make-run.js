const { makePopulateConfig } = require('./make-populate-config');
const { makePopulateSecret } = require('./make-populate-secret');
const { makePromptRequiredConfigs } = require('./make-prompt-required-configs');

const makeRun = ({ stage, interactive, settingsService, parameterStore }) => () => {
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
  makeRun
};
