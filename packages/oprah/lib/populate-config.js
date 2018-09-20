'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const format = require('string-template');
const merge = require('lodash.merge');
const mapValues = require('lodash.mapvalues');
const isEmpty = require('lodash.isempty');

const { readYaml } = require('../lib/read-yaml');
const { generateConfigUpdaters } = require('../lib/secret-store');
const { promptRequiredConfigs } = require('./prompt-required-configs');

const populateConfig = ({ defaultPath, requiredPath, overridePath, ssmPath, noninteractive, variables = {} }) => {
  console.log(chalk.black.bgGreen('Populating configuration in SSM...'));

  if(!ssmPath) {
    console.log(chalk.red('ssmPath is required'));
    return Bluebird.reject(new Error('Please specify ssmPath for populateConfig'));
  }

  const defaultConfig = readYaml({ pathName: defaultPath });
  const overrideConfig = readYaml({ pathName: overridePath });

  if (isEmpty(overrideConfig)) {
    console.log(chalk.yellow('Could not find configuration overrides. Using default values.'));
  }

  const mergedConfig = merge({}, defaultConfig, overrideConfig);

  const interpolatedConfig = mapValues(mergedConfig, value => format(value.toString(), variables));

  const requiredConfigs = requiredPath ? readYaml({ pathName: requiredPath }) : {};

  return promptRequiredConfigs({ ssmPath, requiredConfigs, noninteractive })
  .then(config => Object.assign(config, interpolatedConfig))
  .then(config => {
    const updaters = generateConfigUpdaters({
      config,
      ssmPath
    });

    return Bluebird.mapSeries(updaters, updater => updater().delay(500)).then(vars => {
      return vars.reduce((acc, entry) => {
        return Object.assign({},
          acc,
          entry
          )
      }, {});
    });
  });
};

module.exports = {
  populateConfig
};
