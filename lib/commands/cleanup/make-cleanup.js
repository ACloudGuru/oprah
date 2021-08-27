const get = require('lodash/get');
const property = require('lodash/property');

const makeCleanup = ({ parameterStore, settingsService }) => async () => {
  const settings = await settingsService.getSettings();
  const configPath = get(settings, 'config.path');
  const secretPath = get(settings, 'secret.path');
  const parameters = await Promise.all([
    parameterStore.getAllParameters({ path: configPath }),
    parameterStore.getAllParameters({ path: secretPath })
  ]).then(([configs, secrets]) => [...configs, ...secrets]);

  const { configParameters = [], secretParameters = [] } = settings;
  const unusedParameters = parameters.filter(
    ({ Name }) => ![...configParameters, ...secretParameters].includes(Name)
  );

  return (
    unusedParameters.length &&
    parameterStore.deleteParameters({
      parameterNames: unusedParameters.map(property('Name'))
    })
  );
};

module.exports = { makeCleanup };
