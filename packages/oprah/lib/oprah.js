'use strict';

const chalk = require('chalk');
const get = require('lodash.get');

const path = require('path');

const { validateArguments } = require('../lib/validate-arguments');
const { populateConfig } = require('../lib/populate-config');
const { populateSecret } = require('../lib/populate-secret');
const { readCfOutputs } = require('../lib/read-cf-outputs');

const cwd = process.cwd();

const oprah = ({ stage, service, stackName, skipSecrets }) => {
  validateArguments({ stage, service, stackName, skipSecrets });

  return readCfOutputs({
    stackName
  })
  .tap(outputs => populateConfig({
    defaultPath: path.resolve(cwd, `config/default.yaml`),
    overridePath: path.resolve(cwd, `config/${stage}.yaml`),
    ssmPath: `/${stage}/${service}/config`,
    variables: Object.assign(
      {},
      outputs,
      {
        STAGE: stage
      }
    )
  }))
  .tap(outputs => {
    if (skipSecrets) {
      console.log(chalk.yellow('Skipping SSM secrets'))
      return Promise.resolve();
    }

    return populateSecret({
      requiredPath: path.resolve(cwd, `secret/required.yaml`),
      ssmPath: `/${stage}/${service}/secret`,
      keyId: get(outputs, 'EncryptionKeyAlias')
    });
  })
  .then(() => console.log(chalk.green('Done.')))
  .catch(err => console.log(chalk.red(err)));
};

module.exports = {
  oprah
};
