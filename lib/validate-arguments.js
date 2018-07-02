'use strict';

const chalk = require('chalk');

const validateArguments = ({ stage, service }) => {
  if (!stage) {
    console.log(chalk.red('Stage is required for configuration. (ie. --stage test)'))
    process.exit(1);
  }

  if (!service) {
    console.log(chalk.red('Service is required for configuration. (ie. --service test)'))
    process.exit(1);
  }
}

module.exports = {
  validateArguments
}