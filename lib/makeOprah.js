'use strict';

const { log, logMessage } = require('../lib/utils/logger');
const { getConfig } = require('../lib/utils/config');
const { batchReadCfOutputs } = require('./read-cf-outputs');
const chalk = require('chalk');

const logRunInfo = params => {
  if (params.interactive) {
    logMessage('Running Oprah in interactive mode');
  } else {
    logMessage('Running Oprah in non-interactive mode');
  }

  logMessage(`Stage  --> ${params.stage}`);
  logMessage(`Config --> ${params.config}`);
};

const readCfOutputs = config => {
  const stackNames = config.cfOutputs || [];

  log(chalk.black.bgGreen(`Reading stack outputs for: [${stackNames.toString()}]`))

  return batchReadCfOutputs({ stackNames })
    .tap(outputs => {
      logMessage('Stack outputs:');
      logMessage(JSON.stringify(outputs, null, 2));
    })
};

const makeRun = ({ params }) => () => {
  logRunInfo(params);

  const config = getConfig({
    configFile: params.config,
    variables: params.variables
  });

  return readCfOutputs(config)
    .tap(() => {
    })
    .then(outputs => {
      console.log(outputs);
    });

  // readcf outputs
  // populate config
  // run serverless
  // read serverless cf outputs
  // populate outputs config
  // populate config
};

const makeOprah = ({ params }) => {
  return { run: makeRun({ params }) };
};

module.exports = { makeOprah };
