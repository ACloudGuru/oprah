const get = require('lodash.get');
const { makeGetSettings } = require('./make-get-settings');
const { makeMemoizedGetSettings } = require('./make-memoized-get-settings');

const makeSettingsService = ({ settingsFilePath, variables }) => {
  const getSettings = makeGetSettings({
    settingsFilePath,
    variables
  });

  const memoizedGetSettings = makeMemoizedGetSettings({ getSettings });

  return {
    getSettings: memoizedGetSettings,
    getProvider: () =>
      memoizedGetSettings().then(settings => get(settings, 'provider', {}))
  };
};

module.exports = {
  makeSettingsService
};
