'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const format = require('string-template');
const merge = require('lodash.merge');
const mapValues = require('lodash.mapvalues');
const isEmpty = require('lodash.isempty');

const { readFile } = require('../lib/utils/fs/readFile');
const { generateConfigUpdaters } = require('../lib/secret-store');
const { promptRequiredConfigs } = require('./prompt-required-configs');

const populateConfig = ({ defaultPath, requiredPath, overridePath, ssmPath, noninteractive, variables = {} }) => {
  console.log(chalk.black.bgGreen('Populating configuration in SSM...'));

  if(!ssmPath) {
    console.log(chalk.red('ssmPath is required'));
    return Bluebird.reject(new Error('Please specify ssmPath for populateConfig'));
  }

  const defaultConfig = readFile({ filePath: defaultPath });
  const overrideConfig = readFile({ filePath: overridePath });
  console.log(defaultConfig);

  if (isEmpty(overrideConfig)) {
    console.log(chalk.yellow('Could not find configuration overrides. Using default values.'));
  }

  const mergedConfig = merge({}, defaultConfig, overrideConfig);

  const interpolatedConfig = mapValues(mergedConfig, value => format(value.toString(), variables));

  const requiredConfigs = requiredPath ? readFile({ filePath: requiredPath }) : {};

  return promptRequiredConfigs({ ssmPath, requiredConfigs, noninteractive })
  .then(config => Object.assign(config, interpolatedConfig))
  .then(config => {
    const updaters = generateConfigUpdaters({
      config,
      ssmPath
    });

    return Bluebird.mapSeries(updaters, updater => updater().delay(500));
  });
};

module.exports = {
  populateConfig
};
