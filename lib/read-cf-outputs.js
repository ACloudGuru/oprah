'use strict';

const get = require('lodash.get');
const Bluebird = require('bluebird');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
AWS.config.setPromisesDependency(require('bluebird'));

const cloudformation = new AWS.CloudFormation();

const readCfOutputs = ({ stackName }) => {
  const params = {
    StackName: stackName
  };

  if(!stackName) {
    return Bluebird.reject(new Error('Please specify stackName for readCfOutputs'));
  }

  return cloudformation
    .describeStacks(params)
    .promise()
    .then(res => get(res, 'Stacks.0.Outputs') || [])
    .then(outputs => {
      return outputs.reduce((acc, output) => {
        const key = get(output, 'OutputKey');
        const value = get(output, 'OutputValue');

        return Object.assign({}, acc, { [key]: value });
      }, {});
    })
    .catch(() => {
      return Bluebird.reject(new Error(`Could not find stack outputs for: [${stackName}]`));
    })
};

const batchReadCfOutputs = ({ stackNames }) => {
  return Bluebird
    .map(stackNames, stackName => readCfOutputs({ stackName }))
    .then(outputs => outputs.reduce((acc, output) => Object.assign(acc, output), {}));
};

module.exports = {
  readCfOutputs,
  batchReadCfOutputs
};
