'use strict';

const DataLoader = require('dataloader')
const { makeUpdateConfigs } = require('./make-update-configs');
const { makeUpdateSecrets } = require('./make-update-secrets');
const { getBatchParameters } = require('./get-batch-parameters');
const { makeGetAllParameters } = require('./make-get-all-parameters');

const makeSsmStore = () => {
  const ssmLoader = new DataLoader(keys => getBatchParameters({ parameterNames: keys }));
  const getAllParameters = makeGetAllParameters({ loader: ssmLoader });
  const getLatestVersion = key => ssmLoader.load(key);

  return {
    getAllParameters,
    updateConfigs: makeUpdateConfigs({ getAllParameters, getLatestVersion }),
    updateSecrets: makeUpdateSecrets({ getAllParameters, getLatestVersion })
  };
}

module.exports = {
  makeSsmStore
};
