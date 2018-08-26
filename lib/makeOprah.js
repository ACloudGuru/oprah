'use strict';

const { logMessage, logInfo } = require('../lib/utils/logger');
const { getConfig } = require('../lib/utils/config');
const { batchReadCfOutputs } = require('./read-cf-outputs');
const { populateConfig, populateSecret } = require('./populate');
const { runServerless } = require('./run-serverless');

const deployCustomResources = ({ serverless, stage }) => {
    // run serverless
    // read serverless cf outputs
    // populate outputs config
    if (!serverless) {
      return Promise.resolve({});
    }

    return runServerless({ serverlessYamlDirectory: serverless.configDir, stage })
      .then();
};

const logRunInfo = params => {
  const mode = params.interactive ? 'interactive' : 'non-interactive';

  logInfo(`Running Oprah in ${mode} mode..`);

  logMessage(`Stage  --> ${params.stage}`);
  logMessage(`Config --> ${params.config}`);
};

const makeRun = ({ params }) => () => {
  logRunInfo(params);

  const stage = params.stage;
  const interactive = params.interactive;

  const oprahConfig = getConfig({
    configFile: params.config,
    variables: params.variables
  });

  const stackNames = oprahConfig.cfOutputs || [];
  const serverless = oprahConfig.serverless;

  return batchReadCfOutputs({ stackNames })
    .tap(outputs => {
      const config = oprahConfig.config;
      config.defaults = Object.assign({}, config.defaults, outputs);
      const overrides = config[stage];

      return populateConfig({ config, overrides, interactive });
    })
    .then(() => deployCustomResources({ serverless, stage }))
    .then(() => populateSecret({ secret: oprahConfig.secret, interactive }));
};

const makeOprah = ({ params }) => {
  return { run: makeRun({ params }) };
};

module.exports = { makeOprah };
