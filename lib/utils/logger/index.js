'use strict';

const { logMessage } = require('./logMessage');
const { logWarning } = require('./logWarning');
const { logError } = require('./logError');
const { logInfo } = require('./logInfo');
const { log } = require('./log');
const { logTitle } = require('./logTitle');

module.exports = {
  logMessage,
  logWarning,
  logError,
  logInfo,
  logTitle,
  log
};
