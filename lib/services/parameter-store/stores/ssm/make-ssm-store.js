'use strict';

const { makeUpdateConfigs } = require('./make-update-configs');
const { makeUpdateSecrets } = require('./make-update-secrets');
const { makeGetAllParameters } = require('./make-get-all-parameters');

const makeSsmStore = () => {
  return {
    getAllParameters: makeGetAllParameters(),
    updateConfigs: makeUpdateConfigs(),
    updateSecrets: makeUpdateSecrets()
  };
}

module.exports = {
  makeSsmStore
};
