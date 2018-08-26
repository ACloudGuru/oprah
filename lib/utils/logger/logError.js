'use strict';

const chalk = require('chalk');

const logError = message => console.log(chalk.read(message));

module.exports = { logError };
