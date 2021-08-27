const { makeGetProviderStore } = require('./make-get-provider-store');
const { makeUpdateSecrets } = require('./make-update-secrets');
const { makeUpdateConfigs } = require('./make-update-configs');
const { makeGetParameters } = require('./make-get-parameters');
const { makeGetAllParameters } = require('./make-get-all-parameters');
const { makeDeleteParameters } = require('./make-delete-parameters');

const makeParameterStore = ({ settingsService }) => {
  const getProviderStore = makeGetProviderStore({ settingsService });
  const updateSecrets = makeUpdateSecrets({ getProviderStore });
  const updateConfigs = makeUpdateConfigs({ getProviderStore });
  const getParameters = makeGetParameters({ getProviderStore });
  const getAllParameters = makeGetAllParameters({ getProviderStore });
  const deleteParameters = makeDeleteParameters({ getProviderStore });

  return {
    updateConfigs,
    updateSecrets,
    getParameters,
    getAllParameters,
    deleteParameters
  };
};

module.exports = {
  makeParameterStore
};
