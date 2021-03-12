const map = require('lodash.map');
const get = require('lodash.get');
const chalk = require('chalk');
const prompt = require('prompt');

const promptForValues = ({ requiredValues, currentValues }) => {
  prompt.message = '';
  prompt.delimiter = '';
  prompt.start();

  const schema = map(requiredValues, (value, key) => {
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
