'use strict';

const AWS = require('aws-sdk');

AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ region: 'us-east-1' });

const ssm = new AWS.SSM();
const entries = require('lodash.topairs');
const get = require('lodash.get');

const { logMessage } = require('./utils/logger');

function upload(params) {
  const log = params.Type === 'SecureString' ?
    () => logMessage(`Updating secret: Name: ${params.Name} | Value: [${params.Value.length} chars]`) :
    () => logMessage(`Updating config: Name: ${params.Name} | Value: [${params.Value}]`);

  log();
  return ssm.putParameter(params).promise();
}

function generateConfigUpdaters({ path, config }) {
  return entries(config)
    .map(([key, value]) => {
      const Name = `${path}/${key}`;
      const params = {
        Name,
        Type: 'String',
        Value: value,
        Overwrite: true
      };

      return () => upload(params);
    });
}

function generateSecretUpdaters({ path, secrets, keyId }) {
  return entries(secrets)
    .map(([key, value]) => {
      const Name = `${path}/${key}`;
      const params = {
        Name,
        Type: 'SecureString',
        Value: value,
        Overwrite: true,
        KeyId: keyId || 'alias/aws/ssm'
      };

      return () => upload(params);
    });
}

function getAllSecretsUnderPath({ Path, NextToken, Acc }) {
  return ssm.getParametersByPath({
    Path,
    NextToken,
    WithDecryption: true
  })
  .promise()
  .then(({ Parameters, NextToken }) => {
    const CombinedParameters = [].concat(Acc, Parameters);

    if (NextToken) {
      return getAllSecretsUnderPath({
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

function readRemoteConfigs({ path }) {
  return getAllSecretsUnderPath({ Path: path })
    .then(accumulateConfigs);
}

module.exports = {
  generateConfigUpdaters,
  generateSecretUpdaters,
  readRemoteConfigs
};
