'use strict';

const chalk = require('chalk');
const { log } = require('./log');

const logMessage = message => log(chalk.gray(message));

module.exports = { logMessage };
