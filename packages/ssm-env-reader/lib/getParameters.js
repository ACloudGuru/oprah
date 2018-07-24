'use strict';

const Dataloader = require('dataloader');
const Bluebird = require('bluebird');
const { get } = require('lodash');

const AWS = require('aws-sdk');

const ssm = new AWS.SSM({ apiVersion: '2014-11-06' });

const getSSMParameters = ({ paths = [] }) => {
  if (!paths.length) {
    return Bluebird.resolve({});
  }

  return Bluebird.resolve()
    .then(() => ssm.getParameters({
      Names: paths,
      WithDecryption: true
    }).promise())
}

const validateParameters = ({ InvalidParameters }) => {
  if (InvalidParameters.length) {
    const error = new Error(`Unable to fetch ${InvalidParameters}`);
    console.error(error);
    return Bluebird.reject(error);
  }
};

const orderParameters = ({ paths, Parameters }) => {
  const parameterPathMap = Parameters.reduce(
    (acc, parameter) => {
      const Name = get(parameter, 'Name') || '';
      return Object.assign(
        {},
        acc,
        {
          [Name]: get(parameter, 'Value')
        }
      );
    },
    {}
  );

  return paths.map(path => parameterPathMap[path])
}

const options = {
  maxBatchSize: 10, // SSM getParameters only support up to 10 values
  cache: true
};
const ssmLoader = new Dataloader(paths => {
  return getSSMParameters({ paths })
    .tap(validateParameters)
    .then(({ Parameters }) => orderParameters({ paths, Parameters }))
}, options);

module.exports = {
  getParameters: ({ paths }) => ssmLoader.loadMany(paths)
};
