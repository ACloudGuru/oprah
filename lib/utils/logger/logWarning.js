'use strict';

const chalk = require('chalk');

const logWarning = message => console.log(chalk.yellow(message));

module.exports = { logWarning };
