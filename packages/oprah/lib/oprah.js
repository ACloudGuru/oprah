'use strict';

const chalk = require('chalk');
const get = require('lodash.get');

const { validateArguments } = require('../lib/validate-arguments');
const { populateConfig } = require('../lib/populate-config');
const { populateSecret } = require('../lib/populate-secret');
const { readCfOutputs } = require('../lib/read-cf-outputs');

const oprah = args => {
  validateArguments(args);

  const { stage, service, stackName } = args;

  return readCfOutputs({
    stackName
  })
  .tap(outputs => populateConfig({
    defaultPath: get(args, 'config.defaultPath'),
    overridePath: get(args, 'config.overridePath'),
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
    if (get(args, 'secret.skip')) {
      console.log(chalk.yellow('Skipping SSM secrets'))
      return Promise.resolve();
    }

    return populateSecret({
      requiredPath: get(args, 'secret.requiredPath'),
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
