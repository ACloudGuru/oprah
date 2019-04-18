const Bluebird = require('bluebird');

const map = require('lodash.map');
const get = require('lodash.get');
const chalk = require('chalk');
const prompt = Bluebird.promisifyAll(require('prompt'));

// I wish this was typed. requiredValues is a { key: value } Map
// I wish this was typed. currentValues is a { key: value } Map
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

  return prompt.getAsync(schema);
}

module.exports = {
  promptForValues
};
