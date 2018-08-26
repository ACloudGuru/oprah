'use strict';

const chalk = require('chalk');
const { log } = require('./log');

const logWarning = message => log(chalk.yellow(message));

module.exports = { logWarning };
