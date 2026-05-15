const get = require('lodash/get');
const { makeSsmStore } = require('./stores/ssm/make-ssm-store');
const {
  makeSecretsManagerStore
} = require('./stores/secretsmanager/make-secretsmanager-store');

const makeGetProviderStore = ({ settingsService }) => () =>
  settingsService.getSettings().then(settings => {
    const providerName = get(settings, 'provider.name');

    if (providerName === 'ssm') {
      return makeSsmStore({});
    }

    if (providerName === 'secretsmanager') {
      return makeSecretsManagerStore({});
    }

    throw new Error('Unsupported provider specified');
  });

module.exports = {
  makeGetProviderStore
};
