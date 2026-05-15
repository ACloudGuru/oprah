const DataLoader = require('dataloader');
const { makeUpdateSecrets } = require('./make-update-secrets');
const { getBatchSecrets } = require('./get-batch-secrets');
const {
  makeGetAllParametersByNames
} = require('../ssm/make-get-all-parameters-by-names');

const makeSecretsManagerStore = () => {
  const loader = new DataLoader(keys =>
    getBatchSecrets({ parameterNames: keys })
  );
  const getAllParametersByNames = makeGetAllParametersByNames({ loader });
  const getLatestVersion = key => loader.load(key);

  return {
    getAllParametersByNames,
    updateSecrets: makeUpdateSecrets({
      getLatestVersion,
      getAllParametersByNames
    })
  };
};

module.exports = {
  makeSecretsManagerStore
};
