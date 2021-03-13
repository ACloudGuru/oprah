const get = require('lodash.get');
const chalk = require('chalk');
const prompt = require('prompt');

const promptForValues = ({ requiredValues, currentValues }) => {
  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();

  const schema = Object.entries(requiredValues).map(([key, value]) => {
    const existingValue = get(currentValues, key) || '';
    return {
      name: key,
      description: `Description: ${value}\n${chalk.green(key)}:`,
      default: existingValue,
      type: 'string',
      required: true
    };
  });

  return prompt.get(schema);
};

module.exports = {
  promptForValues
};
