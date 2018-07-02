'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');
const format = require('string-template');
const merge = require('lodash.merge');
const mapValues = require('lodash.mapvalues');
const isEmpty = require('lodash.isempty');

const { readYaml } = require('../lib/read-yaml');
const { generateConfigUpdaters } = require('../lib/secret-store');

const populateConfig = ({ defaultPath, overridePath, ssmPath, variables = {} }) => {
  console.log(chalk.black.bgGreen('Populating configuration in SSM...'));

  const defaultConfig = readYaml({ pathName: defaultPath });
  const overrideConfig = readYaml({ pathName: overridePath });

  if (isEmpty(overrideConfig)) {
    console.log(chalk.yellow('Could not find configuration overrides. Using default values.'));
  }

  const mergedConfig = merge({}, defaultConfig, overrideConfig);

  const interpolatedConfig = mapValues(mergedConfig, value => format(value.toString(), variables));

  return Promise.resolve(interpolatedConfig)
  .then(config => {
    const updaters = generateConfigUpdaters({
      config,
      ssmPath
    });

    return Bluebird.map(updaters, updater => updater(), { concurrency: 5 });
  });
};

module.exports = {
  populateConfig
};
