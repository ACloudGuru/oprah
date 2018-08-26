'use strict';

const chalk = require('chalk');
const { log } = require('./log');

const logError = message => log(chalk.red(message));

module.exports = { logError };
