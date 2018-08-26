'use strict';

const Bluebird = require('bluebird');

const { generateConfigUpdaters } = require('../secret-store');
const { promptRequiredConfigs } = require('../prompt-required-configs');

const populateConfig = ({ config, overrides, interactive }) => {
  const { path, defaults, required } = config;

  if(!path) {
    return Bluebird.reject(new Error('Please specify ssmPath for populateConfig'));
  }

  const mergedConfig = Object.assign({}, defaults, overrides);

  return promptRequiredConfigs({ path, required, interactive })
  .then(config => Object.assign(config, mergedConfig))
  .then(config => {
    const updaters = generateConfigUpdaters({ config, path });

    return Bluebird.mapSeries(updaters, updater => updater().delay(500));
  });
};

module.exports = { populateConfig };
