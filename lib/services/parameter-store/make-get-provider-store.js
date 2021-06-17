const get = require('lodash.get');
const { makeSsmStore } = require('./stores/ssm/make-ssm-store');

const makeGetProviderStore = ({ settingsService }) => () =>
  settingsService.getSettings().then(settings => {
    if (get(settings, 'provider.name') === 'ssm') {
      return makeSsmStore({});
    }

    throw new Error('Unsupported provider specified');
  });

module.exports = {
  makeGetProviderStore
};
