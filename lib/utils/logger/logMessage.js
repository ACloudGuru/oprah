'use strict';

const chalk = require('chalk');

const logMessage = message => console.log(chalk.gray(message));

module.exports = { logMessage };
