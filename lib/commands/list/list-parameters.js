const chalk = require('chalk');

const { log } = require('../../utils/logger');

const maskValue = value => {
  const stringToMask = value || '';
  return stringToMask.replace(/\S(?=\S{4})/g, "*");
}

const listParameters = ({ parameters, mask }) => {
  Object.keys(parameters)
    .map(key => {
      const value = parameters[key];
      const loggedValue = mask
      ? maskValue(value)
      : value;

      return log(chalk.gray(`  ${key}: ${loggedValue}`))
    });

  return parameters;
}

module.exports = {
  listParameters
};
