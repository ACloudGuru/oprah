const DataLoader = require('dataloader');
const { makeUpdateConfigs } = require('./make-update-configs');
const { makeUpdateSecrets } = require('./make-update-secrets');
const { getBatchParameters } = require('./get-batch-parameters');
const {
  makeGetAllParametersByNames
} = require('./make-get-all-parameters-by-names');
const { getAllParametersByPath } = require('./get-all-parameters-by-path');
const { deleteParameters } = require('./delete-parameters');

const makeSsmStore = () => {
  const ssmLoader = new DataLoader(keys =>
    getBatchParameters({ parameterNames: keys })
  );
  const getAllParametersByNames = makeGetAllParametersByNames({
    loader: ssmLoader
  });
  const getLatestVersion = key => ssmLoader.load(key);

  return {
    getAllParametersByPath,
    getAllParametersByNames,
    updateConfigs: makeUpdateConfigs({
      getAllParametersByNames,
      getLatestVersion
    }),
    updateSecrets: makeUpdateSecrets({
      getAllParametersByNames,
      getLatestVersion
    }),
    deleteParameters
  };
};

module.exports = {
  makeSsmStore
};
