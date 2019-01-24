const get = require('lodash.get');
const { makeAppendCfOutputs } = require('./make-append-cf-outputs');
const { makeGetSettings } = require('./make-get-settings');
const { makeMemoizedGetSettings } = require('./make-memoized-get-settings');

const makeSettingsService =
({
  settingsFilePath,
  variables,
  cfService
}) => {
  const appendCfOutputs = makeAppendCfOutputs({
    cfService
  });

  const getSettings = makeGetSettings({
    settingsFilePath,
    variables,
    appendCfOutputs
  });

  const memoizedGetSettings = makeMemoizedGetSettings({ getSettings });

  return {
    getSettings: memoizedGetSettings,
    getProvider: () => memoizedGetSettings().then(settings => get(settings, 'provider', {}))
  };
}

module.exports = {
  makeSettingsService
};
