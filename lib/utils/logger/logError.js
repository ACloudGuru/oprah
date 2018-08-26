'use strict';

const chalk = require('chalk');
const { log } = require('./log');

const logError = message => log(chalk.red(`ERROR: ${message}`));

module.exports = { logError };
