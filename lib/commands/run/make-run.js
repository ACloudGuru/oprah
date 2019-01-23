const { populateConfig } = require('./populate-config');
const { populateSecret } = require('./populate-secret');

const makeRun = ({ stage, interactive, getSettings, parameterStore }) => () => {

  return getSettings()
  .tap((settings) => {
    if (!settings.config) { return; }

    const config = settings.config;
    config.defaults = Object.assign({}, config.defaults, settings.outputs);

    const overrides = config[stage];

    return populateConfig({
      settings,
      config,
      overrides,
      interactive,
      parameterStore
    });
  })
  .then(settings => {
    if (!settings.secret) { return; }

    return populateSecret({
      settings,
      secret: settings.secret,
      interactive,
      parameterStore
    });
  });
};

module.exports = {
  makeRun
};
