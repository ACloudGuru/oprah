'use strict';

const chalk = require('chalk');
const { log } = require('./log');

const logInfo = message => log(chalk.white(message));

module.exports = { logInfo };
