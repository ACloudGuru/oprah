const get = require('lodash.get');
const Bluebird = require('bluebird');
const path = require('path');

const { log } = require('../../utils/logger');

// TODO: create helper method on settings service to validate provider
const makeInit = ({ settingsService, cfService }) => {

  const initSsm = () => Bluebird.resolve();

  const initDdb = ({ tableName }) => {
    return cfService.deploy({
      name: `${tableName}`,
      template: path.resolve(__dirname, '../../../cf-templates/dynamodb.yml'),
      params: {
        TableName: tableName
      }
    });
  }

  return () => {
    return settingsService.getSettings()
      .then(settings => {
        const providerName = get(settings, 'provider.name');

        if (providerName === 'ddb') {
          return initDdb({
            tableName: get(settings, 'provider.tableName')
          });
        }

        return initSsm();
      })
      .then(() => log('Initialization complete'));
  };
}


module.exports = {
  makeInit
};
