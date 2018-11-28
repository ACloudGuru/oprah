'use strict';

const chalk = require('chalk');
const { log } = require('./log');

const logTitle = message => log(chalk.black.bgGreen(message));

module.exports = { logTitle };
