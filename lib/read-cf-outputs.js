'use strict';

const get = require('lodash.get');
const chalk = require('chalk');
const Bluebird = require('bluebird');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });
AWS.config.setPromisesDependency(require('bluebird'));

const cloudformation = new AWS.CloudFormation();

const readCfOutputs = ({ stackName }) => {
  console.log(chalk.black.bgGreen(`Reading stack outputs for: [${stackName}]`))
  const params = {
    StackName: stackName
  };

  if(!stackName) {
    console.log(chalk.red('stackName is required'));
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
        return Object.assign(
          {},
          acc,
          {
            [key]: value
          }
        );
      }, {});
    })
    .catch(() => {
      console.log(chalk.yellow(`Could not find stack outputs for: [${stackName}]`))
      return {};
    })
    .tap(outputs => {
      console.log(chalk.grey('Stack outputs:'));
      console.log(chalk.grey(JSON.stringify(outputs, null, 2)))
    })
}



module.exports = {
  readCfOutputs
};
