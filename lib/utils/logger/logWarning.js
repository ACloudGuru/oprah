'use strict';

const chalk = require('chalk');
const { log } = require('./log');

const logWarning = message => log(chalk.yellow(`WARNING: ${message}`));

module.exports = { logWarning };
