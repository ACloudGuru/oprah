const get = require('lodash.get');
const path = require('path');

// TODO: create helper method on settings service to validate provider
const makeInit = ({ settingsService, cfService }) => {
  const initSsm = () => Promise.resolve();

  const initDdb = ({ tableName }) =>
    cfService.deploy({
      name: `${tableName}`,
      template: path.resolve(__dirname, '../../../cf-templates/dynamodb.yml'),
      params: {
        TableName: tableName
      }
    });

  return async () => {
    const settings = await settingsService.getSettings();

    const providerName = get(settings, 'provider.name');

    if (providerName === 'ddb') {
      return initDdb({
        tableName: get(settings, 'provider.tableName')
      });
    }

    return initSsm();
  };
};

module.exports = {
  makeInit
};
