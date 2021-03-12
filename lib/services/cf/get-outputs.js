const get = require('lodash.get');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' });

const cloudformation = new AWS.CloudFormation();
const chalk = require('chalk');
const { log, logWarning } = require('../../utils/logger');

const readCfOutputs = async ({ stackName }) => {
  if (!stackName) {
    throw new Error('Please specify stackName for readCfOutputs');
  }

  const params = { StackName: stackName };

  const outputs = await cloudformation
    .describeStacks(params)
    .promise()
    .then(res => get(res, 'Stacks.0.Outputs') || [])
    .then(res =>
      res.reduce((acc, output) => {
        const key = get(output, 'OutputKey');
        const value = get(output, 'OutputValue');

        return { ...acc, [key]: value };
      }, {})
    )
    .catch(() => {
      logWarning(`Could not find stack outputs for: [${stackName}]`);
      return {};
    });

  log(chalk.cyan(`Stack outputs for: [${stackName}]`));
  log(chalk.gray(JSON.stringify(outputs, null, 2)));
};

const getOutputs = ({ stackNames = [] }) =>
  Promise.all(stackNames, stackName =>
    readCfOutputs({ stackName })
  ).then(outputs =>
    outputs.reduce((acc, output) => Object.assign(acc, output), {})
  );

module.exports = {
  getOutputs
};
