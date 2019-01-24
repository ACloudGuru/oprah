const chalk = require('chalk');

const { log } = require('../../utils/logger');

const listParameters = parameters => {
  Object.keys(parameters)
    .map(key => log(chalk.gray(`  ${key}: ${parameters[key]}`)));

  return parameters;
}

module.exports = {
  listParameters
};
