'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const map = require('lodash.map');
const get = require('lodash.get');
const prompt = Bluebird.promisifyAll(require('prompt'));

const { readYaml } = require('../lib/read-yaml');
const { generateSecretUpdaters, readRemoteSecrets } = require('../lib/secret-store');

const populateSecret = ({ requiredPath, ssmPath, keyId }) => {
  console.log(chalk.black.bgGreen('Populating secrets in SSM...'))

  if(!ssmPath) {
    console.log(chalk.red('ssmPath is required'));
    return Bluebird.reject(new Error('Please specify ssmPath for populateSecret'));
  }

  const requiredSecret = readYaml({
    pathName: requiredPath
  });

  return readRemoteSecrets({
    ssmPath
  })
  .then(currentSecrets => {
    prompt.message = '';
    prompt.delimiter = '';
    prompt.start();

    const schema = map(requiredSecret, (value, key) => {
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
  .then(secret => {
    const updaters = generateSecretUpdaters({
      secret,
      ssmPath,
      keyId
    });

    return Bluebird.map(updaters, updater => updater(), { concurrency: 5 });
  })
};

module.exports = {
  populateSecret
};
