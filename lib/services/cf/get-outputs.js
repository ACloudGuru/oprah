'use strict';

const get = require('lodash.get');
const Bluebird = require('bluebird');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
AWS.config.setPromisesDependency(require('bluebird'));

const cloudformation = new AWS.CloudFormation();
const chalk = require('chalk');
const { log, logWarning } = require('../../utils/logger');

const readCfOutputs = ({ stackName }) => {
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
      log(chalk.cyan(`Stack outputs for: [${stackName}]`));
      log(chalk.gray(JSON.stringify(outputs, null, 2)));
    });
};

const getOutputs = ({ stackNames }) => {
  stackNames = stackNames || [];

  return Bluebird
    .map(stackNames, stackName => readCfOutputs({ stackName }))
    .then(outputs => outputs.reduce((acc, output) => Object.assign(acc, output), {}));
};

module.exports = {
  getOutputs
};
