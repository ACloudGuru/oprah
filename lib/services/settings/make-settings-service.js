const get = require('lodash.get');
const { getConfig } = require('./getConfig');

let getSettingsPromise = null;
const makeGetSettings = ({ settingsFilePath, variables }) => () => {
  if (!getSettingsPromise) {
    getSettingsPromise = getConfig({
      configFile: settingsFilePath,
      variables: variables
    })
  }

  return getSettingsPromise;
}

const makeSettingsService =
({
  settingsFilePath,
  variables
}) => {
  const getSettings = makeGetSettings({
    settingsFilePath,
    variables
  });

  return {
    getSettings,
    getProvider: () => getSettings.then(settings => get(settings, 'provider', {}))
  };
}

module.exports = {
  makeSettingsService
};
