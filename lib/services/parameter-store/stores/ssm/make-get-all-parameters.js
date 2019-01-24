'use strict';

const { getSsmClient } = require('./get-ssm-client');
const get = require('lodash.get');
const chunk = require('lodash.chunk');
const flatten = require('lodash.flatten');

function getAllParametersInSSM({ parameterNames }) {
  const ssm = getSsmClient();

  return Promise.all(
    chunk(parameterNames, 10)
    .map(chunkOfTen => {
      return ssm.getParameters({
        Names: chunkOfTen,
        WithDecryption: true
      })
      .promise()
      .then(res => get(res, 'Parameters'))
    })
  )
  .then(flatten);
}

function accumulateConfigs(allConfigs) {
  return allConfigs.reduce((acc, parameterObject) => {
    const parameterPath = get(parameterObject, 'Name') || '';
    const key = parameterPath.split('/').pop();

    if (!key) {
      return acc;
    }

    return Object.assign({}, acc, { [key]: get(parameterObject, 'Value') });
  }, {});
}

const makeGetAllParameters =
() =>
  ({ parameterNames}) => {
    return getAllParametersInSSM({ parameterNames })
    .then(accumulateConfigs);
  }

module.exports = {
  makeGetAllParameters
};
