const { makePopulateConfig } = require('./make-populate-config');
const { makePopulateSecret } = require('./make-populate-secret');

const makeRun = ({ stage, interactive, settingsService, parameterStore }) => () => {

  const populateConfig = makePopulateConfig({ parameterStore });
  const populateSecret = makePopulateSecret({ parameterStore });

  return settingsService.getSettings()
  .tap((settings) => {
    if (!settings.config) { return; }

    const config = settings.config;
    config.defaults = Object.assign({}, config.defaults, settings.outputs);

    const overrides = config[stage];

    return populateConfig({
      settings,
      config,
      overrides,
      interactive
    });
  })
  .then(settings => {
    if (!settings.secret) { return; }

    return populateSecret({
      settings,
      secret: settings.secret,
      interactive
    });
  });
};

module.exports = {
  makeRun
};
