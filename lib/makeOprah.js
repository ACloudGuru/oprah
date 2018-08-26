'use strict';

const { logMessage } = require('../lib/utils/logger');
const { getConfig } = require('../lib/utils/config');

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

  const config = getConfig({ configFile: params.config, variables: params.variables });

  console.log(config);
};

const makeOprah = ({ params }) => {
  return { run: makeRun({ params }) };
};

module.exports = { makeOprah };
