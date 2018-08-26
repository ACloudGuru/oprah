'use strict';

const { logMessage } = require('../lib/utils/logger');
const { getConfig } = require('../lib/utils/config');
const { batchReadCfOutputs } = require('./read-cf-outputs');
const { populateConfig } = require('./populate');

const logRunInfo = params => {
  if (params.interactive) {
    logMessage('Running Oprah in interactive mode');
  } else {
    logMessage('Running Oprah in non-interactive mode');
  }

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

  // readcf outputs
  return batchReadCfOutputs({ stackNames })
    // populate config
    .tap(outputs => {
      const config = oprahConfig.config;
      config.defaults = Object.assign({}, config.defaults, outputs);
      const overrides = config[stage];

      return populateConfig({ config, overrides, interactive });
    })
    // run serverless
    .then(outputs => {
      console.log(outputs);
    });

  // read serverless cf outputs
  // populate outputs config
  // populate config
};

const makeOprah = ({ params }) => {
  return { run: makeRun({ params }) };
};

module.exports = { makeOprah };
