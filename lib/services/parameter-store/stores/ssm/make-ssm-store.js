'use strict';

const DataLoader = require('dataloader')
const { makeUpdateConfigs } = require('./make-update-configs');
const { makeUpdateSecrets } = require('./make-update-secrets');
const { makeGetAllParameters } = require('./make-get-all-parameters');

const makeSsmStore = () => {
  const getAllParameters = makeGetAllParameters();
  const ssmLoader = new DataLoader(keys => getAllParameters({ parameterNames: keys }));

  return {
    getAllParameters: ({ parameterNames }) => ssmLoader.loadMany(parameterNames),
    updateConfigs: makeUpdateConfigs(),
    updateSecrets: makeUpdateSecrets()
  };
}

module.exports = {
  makeSsmStore
};
