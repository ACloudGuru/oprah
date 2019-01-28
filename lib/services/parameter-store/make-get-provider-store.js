const get = require('lodash.get');
const { makeSsmStore } = require('./stores/ssm/make-ssm-store');
const { makeDdbStore } = require('./stores/ddb/make-ddb-store');

const makeGetProviderStore =
({ settingsService }) =>
  () => {
    return settingsService.getSettings()
    .then(settings => {
      if (get(settings, 'provider.name') === 'ddb') {
        return makeDdbStore({
          tableName: get(settings, 'provider.tableName')
        });
      }

      if (get(settings, 'provider.name') === 'ssm') {
        return makeSsmStore({});
      }

      throw new Error('Unsupported provider specified');
    });
  };

module.exports = {
  makeGetProviderStore
};
