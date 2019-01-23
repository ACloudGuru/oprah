'use strict';

const chalk = require('chalk');
const { log } = require('../lib/utils/logger');
const { getConfig } = require('../lib/utils/config');
const { populateConfig, populateSecret } = require('./services');
const { makeParameterStore } = require('./make-parameter-store');
const { makeList } = require('./services/list-config');

const makeRun = ({ stage, interactive, getSettings, parameterStore }) => () => {

  return getSettings
  .tap((mergedConfig) => {
    if (!mergedConfig.config) { return; }

    const config = mergedConfig.config;
    config.defaults = Object.assign({}, config.defaults, mergedConfig.outputs);

    const overrides = config[stage];

    return populateConfig({
      config,
      overrides,
      interactive,
      parameterStore
    });
  })
  .then(mergedConfig => {
    if (!mergedConfig.secret) { return; }

    return populateSecret({
      secret: mergedConfig.secret,
      interactive,
      parameterStore
    });
  });
};

let getSettingsPromise = null;
const makeGetSettings = ({ params }) => () => {
  if (!getSettingsPromise) {
    getSettingsPromise = getConfig({
      configFile: params.config,
      variables: params.variables
    })
  }

  return getSettingsPromise;
}

const makeOprah = ({ params }) => {
  const getSettings = makeGetSettings({ params });
  const parameterStore = makeParameterStore({ getSettings });

  log(chalk.gray(`Stage  --> ${params.stage}`));
  log(chalk.gray(`Config --> ${params.config}`));
  log(chalk.cyan(`Running Oprah in ${params.interactive ? 'interactive' : 'non-interactive'} mode..`));

  return {
    run: makeRun({
      interactive: params.interactive,
      stage: params.stage,
      getSettings,
      parameterStore
    }),
    list: makeList({ getSettings, parameterStore })
  };
};

module.exports = { makeOprah };
