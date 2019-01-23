'use strict';

const AWS = require('aws-sdk');
const get = require('lodash.get');
const Bluebird = require('bluebird');
const entries = require('lodash.topairs');
const chunk = require('lodash.chunk');
const flatten = require('lodash.flatten');

AWS.config.setPromisesDependency(require('bluebird'));
AWS.config.update({ region: 'us-east-1' });

const ssm = new AWS.SSM();

function makeUpdateConfig({ path, key, value }) {
  const Name = `${path}/${key}`;
  const params = {
    Name,
    Type: 'String',
    Value: value,
    Overwrite: true
  };

  return () => ssm.putParameter(params)
    .promise()
    .then(() => ({ key, value }));
}

function makeUpdateSecret({ path, key, value }) {
  const Name = `${path}/${key}`;
  const params = {
    Name,
    Type: 'SecureString',
    Value: value,
    Overwrite: true,
    KeyId: 'alias/aws/ssm'
  };

  return () => ssm.putParameter(params)
    .promise()
    .then(() => ({ key, value }));
}

function getAllParametersInSSM({ parameterNames }) {
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

function getAllParameters({ parameterNames }) {
  return getAllParametersInSSM({ parameterNames })
  .then(accumulateConfigs);
}

function updateConfigs({ configs, path, onComplete = () => Promise.resolve() }) {
  const updaters = entries(configs).map(([key, value]) => makeUpdateConfig({ path, key, value }));
  return Bluebird.mapSeries(updaters, updater => updater().then(onComplete).delay(500));
}

function updateSecrets({ secrets, path, onComplete = () => Promise.resolve() }) {
  const updaters =  entries(secrets).map(([key, value]) => makeUpdateSecret({ path, key, value }));
  return Bluebird.mapSeries(updaters, updater => updater().then(onComplete).delay(500));
}

module.exports = {
  getAllParameters,
  updateConfigs,
  updateSecrets
};
