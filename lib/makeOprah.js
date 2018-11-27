'use strict';

const { logMessage, logInfo } = require('../lib/utils/logger');
const { getConfig } = require('../lib/utils/config');
const { batchReadCfOutputs } = require('./read-cf-outputs');
const { populateConfig, populateSecret } = require('./populate');

const logRunInfo = params => {
  const mode = params.interactive ? 'interactive' : 'non-interactive';

  logInfo(`Running Oprah in ${mode} mode..`);

  logMessage(`Stage  --> ${params.stage}`);
  logMessage(`Config --> ${params.config}`);
};

const makeRun = ({ params }) => () => {
  logRunInfo(params);

  const interactive = params.interactive;

  return getConfig({
    configFile: params.config,
    variables: params.variables
  })
  .then(configs => {
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
