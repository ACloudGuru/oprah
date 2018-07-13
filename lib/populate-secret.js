'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const map = require('lodash.map');
const foreach = require('lodash.foreach');
const get = require('lodash.get');
const prompt = Bluebird.promisifyAll(require('prompt'));

const { readYaml } = require('../lib/read-yaml');
const { generateSecretUpdaters, readRemoteSecrets } = require('../lib/secret-store');

const getAllExistingSecrets = (requiredSecrets, currentSecrets) => {
  const secrets = {};

  if (!requiredSecrets) {
    return Bluebird.resolve(secrets);
  }

  let invalid = false;
  foreach(requiredSecrets, (value, key) => {
    const currentSecret = get(currentSecrets, key);

    if (!currentSecret) {
      invalid = true;
      console.log(chalk.red(`[${key}: ${value}] is missing!`));
    }

    secrets[key] = currentSecret;
  });

  return invalid ?
    Bluebird.reject(new Error('Missing required configurations!!')) :
    Bluebird.resolve(secrets);
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
