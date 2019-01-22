'use strict';

const AWS = require('aws-sdk');
const get = require('lodash.get');

AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ region: 'us-east-1' });

const ssm = new AWS.SSM();

function getAllParametersInSSM({ Path, NextToken, Acc }) {
  return ssm.getParametersByPath({
    Path,
    NextToken,
    WithDecryption: true
  })
  .promise()
  .then(({ Parameters, NextToken }) => {
    const CombinedParameters = [].concat(Acc, Parameters);

    if (NextToken) {
      return getAllParametersInSSM({
        Path,
        NextToken,
        Acc: CombinedParameters
      });
    }

    return CombinedParameters;
  })
  .catch(() => []);
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

function getAllParameters({ path }) {
  return getAllParametersInSSM({ Path: path })
  .then(accumulateConfigs);
}

module.exports = {
  getAllParameters
};
