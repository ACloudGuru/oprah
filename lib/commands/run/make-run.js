const { makePopulateConfig } = require('./make-populate-config');
const { makePopulateSecret } = require('./make-populate-secret');

const makeRun = ({ stage, interactive, settingsService, parameterStore }) => () => {

  const populateConfig = makePopulateConfig({ parameterStore });
  const populateSecret = makePopulateSecret({ parameterStore });

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
