'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const map = require('lodash.map');
const get = require('lodash.get');
const prompt = Bluebird.promisifyAll(require('prompt'));

const { readYaml } = require('../lib/read-yaml');
const { generateSecretUpdaters, readRemoteSecrets } = require('../lib/secret-store');

const getAllExistingSecrets = (requiredSecrets, currentSecrets) => {
  if (!requiredSecrets) {
    return Bluebird.resolve({});
  }

  const secrets = Object.keys(requiredSecrets)
    .filter((key) => {
      if (!currentSecrets[key]) {
        console.log(chalk.yellow(`[${key}: ${requiredSecrets[key]}] is missing!`));
      }

      return currentSecrets[key];
    })
    .reduce((secrets, key) => {
      secrets[key] = currentSecrets[key];
      return secrets;
    }, {});

  const hasMissingSecrets = Object.keys(secrets).length !== Object.keys(requiredSecrets).length;

  if (hasMissingSecrets) {
    console.log(chalk.red('Missing required secrets!! Run on interactive mode to populate them!!'));
    return Bluebird.reject(new Error('Missing required secrets!!'));
  }

  return Bluebird.resolve(secrets);
};

const populateSecret = ({ requiredPath, ssmPath, keyId, noninteractive }) => {
  console.log(chalk.black.bgGreen('Populating secrets in SSM...'));

  if(!ssmPath) {
    console.log(chalk.red('ssmPath is required'));
    return Bluebird.reject(new Error('Please specify ssmPath for populateSecret'));
  }

  const requiredSecrets = readYaml({ pathName: requiredPath });

  return readRemoteSecrets({ ssmPath })
    .then(currentSecrets => {
      if (noninteractive === true) {
        console.log(chalk.blue('Running on non interactive mode..'));
        return getAllExistingSecrets(requiredSecrets, currentSecrets);
      }

      prompt.message = '';
      prompt.delimiter = '';
      prompt.start();

      const schema = map(requiredSecrets, (value, key) => {
        const existingValue = get(currentSecrets, key) || '';
        return {
          name: key,
          description: `Description: ${value}\n${chalk.green(key)}:`,
          default: existingValue,
          type: 'string',
          required: true
        };
      });

      return prompt.getAsync(schema);
    })
    .then(secrets => {
      const updaters = generateSecretUpdaters({
        secrets,
        ssmPath,
        keyId
      });

      return Bluebird.map(updaters, updater => updater(), { concurrency: 5 });
    });
};

module.exports = {
  populateSecret
};
