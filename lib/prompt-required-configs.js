'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const map = require('lodash.map');
const get = require('lodash.get');
const prompt = Bluebird.promisifyAll(require('prompt'));
const { readRemoteConfigs } = require('../lib/secret-store');

const getAllExistingConfigs = (requiredConfigs, currentConfigs) => {
  if (!requiredConfigs) {
    return Bluebird.resolve({});
  }

  const configs = Object.keys(requiredConfigs)
    .filter((key) => {
      if (!currentConfigs[key]) {
        console.log(chalk.yellow(`Config missing: [${key}: ${requiredConfigs[key]}]`));
      }

      return currentConfigs[key];
    })
    .reduce((configs, key) => {
      configs[key] = currentConfigs[key];
      return configs;
    }, {});

  const hasMissingConfigs = Object.keys(configs).length !== Object.keys(requiredConfigs).length;

  if (hasMissingConfigs) {
    console.log(chalk.white.bgRed('Missing required configs!! Run on interactive mode to populate them!!'));
    return Bluebird.reject(new Error('Missing required configs!!'));
  }

  return Bluebird.resolve(configs);
};

const promptRequiredConfigs = ({ path, required, interactive }) => {

  return readRemoteConfigs({ path })
    .then(currentConfigs => {
      if (interactive !== true) {
        console.log(chalk.gray('Running on non interactive mode..'));
        return getAllExistingConfigs(required, currentConfigs);
      }

      prompt.message = '';
      prompt.delimiter = '';
      prompt.start();

      const schema = map(required, (value, key) => {
        const existingValue = get(currentConfigs, key) || '';
        return {
          name: key,
          description: `Description: ${value}\n${chalk.green(key)}:`,
          default: existingValue,
          type: 'string',
          required: true
        };
      });

      return prompt.getAsync(schema);
    });
};

module.exports = { promptRequiredConfigs };
