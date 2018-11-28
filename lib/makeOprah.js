'use strict';

const { logMessage, logInfo, logTitle } = require('../lib/utils/logger');
const { getConfig } = require('../lib/utils/config');
const { batchReadCfOutputs } = require('./read-cf-outputs');
const { populateConfig, populateSecret } = require('./populate');
const { getParameters } = require('./get-parameters');

const listConfigurations = path => {
  return getParameters({ path })
    .tap(params => {
      Object.keys(params)
        .map(key => console.log(`  ${key}: ${params[key]}`));

      return params;
    });
};

const makeRun = ({ params }) => () => {
  logMessage(`Stage  --> ${params.stage}`);

  logMessage(`Config --> ${params.config}`);

  const configPromise = getConfig({
    configFile: params.config,
    variables: params.variables
  });

  if (params.list === true) {
    logInfo(`Listing all configurations..`);

    return configPromise
      .tap(() => logTitle('Configs:'))
      .tap(configs => listConfigurations(configs.config && configs.config.path))
      .tap(() => logTitle('Secrets:'))
      .tap(configs => listConfigurations(configs.secret && configs.secret.path))
  }

  logInfo(`Running Oprah in ${params.interactive ? 'interactive' : 'non-interactive'} mode..`);

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
