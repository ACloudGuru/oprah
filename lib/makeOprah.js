'use strict';

const chalk = require('chalk');
const get = require('lodash.get');
const { log } = require('../lib/utils/logger');
const { getConfig } = require('../lib/utils/config');
const { batchReadCfOutputs } = require('./read-cf-outputs');
const { populateConfig, populateSecret } = require('./populate');
const { getParameters } = require('./get-parameters');

const listConfigurations = ({ path, message, provider }) => {
  return getParameters({ path, provider })
    .tap(params => {
      log(chalk.cyan(message));

      Object.keys(params)
        .map(key => console.log(chalk.gray(`  ${key}: ${params[key]}`)));

      return params;
    });
};

const makeRun = ({ params }) => () => {
  log(chalk.gray(`Stage  --> ${params.stage}`));
  log(chalk.gray(`Config --> ${params.config}`));

  const configPromise = getConfig({
    configFile: params.config,
    variables: params.variables
  });

  if (params.list === true) {
    log(chalk.white(`Listing all configurations..`));

    return configPromise
      .tap(configs => listConfigurations({
        provider: get(configs, 'provider') || 'ssm',
        path: get(configs, 'config.path'),
        message: 'Configs:'
      }))
      .tap(configs => listConfigurations({
        provider: get(configs, 'provider') || 'ssm',
        path: get(configs, 'secret.path'),
        message: 'Secrets:'
      }))
  }

  log(chalk.cyan(`Running Oprah in ${params.interactive ? 'interactive' : 'non-interactive'} mode..`));

  const interactive = params.interactive;

  return configPromise.then(configs => {
    return batchReadCfOutputs({ stackNames: configs.cfOutputs })
      .then(outputs => Object.assign({}, configs, { outputs }))
  })
  .tap(configs => {
    if (!configs.config) { return; }

    const config = configs.config;
    config.defaults = Object.assign({}, config.defaults, configs.outputs);

    const overrides = config[params.stage];

    return populateConfig({ config, overrides, interactive });
  })
  .then(configs => {
    if (!configs.secret) { return; }

    return populateSecret({ secret: configs.secret, interactive });
  });
};

const makeOprah = ({ params }) => {
  return { run: makeRun({ params }) };
};

module.exports = { makeOprah };
