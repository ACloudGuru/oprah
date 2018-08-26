'use strict';

const { logMessage } = require('../lib/utils/logger');
const { getConfig } = require('../lib/utils/config');
const Bluebird = require('Bluebird');
const { readCfOutputs } = require('./read-cf-outputs');

const logRunInfo = params => {
  if (params.interactive) {
    logMessage('Running Oprah in interactive mode');
  } else {
    logMessage('Running Oprah in non-interactive mode');
  }

  logMessage(`Stage  --> ${params.stage}`);
  logMessage(`Config --> ${params.config}`);
};

const readCloudformationOutputs = params => {
  console.log(params.cfOutputs);
  return Bluebird.map(params.cfOutputs)
    .then(readCfOutputs);
};

const makeRun = ({ params }) => () => {
  logRunInfo(params);

  const config = getConfig({ configFile: params.config, variables: params.variables });
  console.log(config);

//   return readCloudformationOutputs(config).then(outputs => {
//     console.log(outputs);
//   });

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
