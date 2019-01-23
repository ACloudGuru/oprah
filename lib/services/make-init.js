const { makeCfService } = require('./cf/make-cf-service');
const get = require('lodash.get');
const Bluebird = require('bluebird');
const path = require('path');
const { log } = require('../utils/logger');

const initSsm = () => Bluebird.resolve();

const initDdb = ({ tableName }) => {
  if (!tableName) {
    throw new Error('provider.tableName is required to initialize with ddb');
  }

  const cfService = makeCfService();
  return cfService.deploy({
    name: `oprah-${tableName}`,
    template: path.resolve(__dirname, '../../cf/dynamodb.yml'),
    params: {
      TableName: tableName
    }
  });
}

const makeInit = ({ getSettings }) =>
  () => {
    return getSettings()
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

module.exports = {
  makeInit
};
