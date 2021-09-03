const get = require('lodash/get');
const AWS = require('aws-sdk');

const cloudformation = new AWS.CloudFormation();
const chalk = require('chalk');
const { log, logWarning } = require('../../utils/logger');

const readCfOutputs = async ({ stackName }) => {
  log(chalk.cyan(`Getting stack outputs for: [${stackName}]`));

  if (!stackName) {
    throw new Error('Please specify stackName for "stacks"');
  }

  const params = { StackName: stackName };

  return cloudformation
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
};

const getOutputs = ({ stackNames = [] }) =>
  Promise.all(
    stackNames.map(stackName => readCfOutputs({ stackName }))
  ).then(outputs =>
    outputs.reduce((acc, output) => ({ ...acc, ...output }), {})
  );

module.exports = {
  getOutputs
};
