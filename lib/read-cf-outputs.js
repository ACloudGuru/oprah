'use strict';

const get = require('lodash.get');
const Bluebird = require('bluebird');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
AWS.config.setPromisesDependency(require('bluebird'));

const cloudformation = new AWS.CloudFormation();
const { logMessage, logInfo, logWarning } = require('../lib/utils/logger');

const readCfOutputs = ({ stackName }) => {
  logInfo(`Reading stack outputs for: [${stackName}]`);

  if(!stackName) {
    return Bluebird.reject(new Error('Please specify stackName for readCfOutputs'));
  }

  const params = { StackName: stackName };

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
      logWarning(`Could not find stack outputs for: [${stackName}]`);
      return {};
    })
    .tap(outputs => {
      logMessage(`Stack outputs for: [${stackName}]`);
      logMessage(JSON.stringify(outputs, null, 2));
    });
};

const batchReadCfOutputs = ({ stackNames }) => {
  stackNames = stackNames || [];

  return Bluebird
    .map(stackNames, stackName => readCfOutputs({ stackName }))
    .then(outputs => outputs.reduce((acc, output) => Object.assign(acc, output), {}));
};

module.exports = {
  readCfOutputs,
  batchReadCfOutputs
};
