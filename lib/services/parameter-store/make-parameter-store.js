'use strict';

const { makeGetProviderStore } = require('./make-get-provider-store');
const { makeUpdateSecrets } = require('./make-update-secrets');
const { makeUpdateConfigs } = require('./make-update-configs');
const { makeGetParameters } = require('./make-get-parameters');

const makeParameterStore = ({ settingsService }) => {
    const getProviderStore = makeGetProviderStore({ settingsService });
    const updateSecrets = makeUpdateSecrets({ getProviderStore });
    const updateConfigs = makeUpdateConfigs({ getProviderStore });
    const getParameters = makeGetParameters({ getProviderStore });

    return {
      updateConfigs,
      updateSecrets,
      getParameters
    }
  }

module.exports = {
  makeParameterStore
};
