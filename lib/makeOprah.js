'use strict';

const chalk = require('chalk');
const { log } = require('../lib/utils/logger');
const { getConfig } = require('../lib/utils/config');
const { populateConfig, populateSecret } = require('./services');
const { makeParameterStore } = require('./services/parameter-store/make-parameter-store');
const { makeCfService } = require('./services/cf/make-cf-service');
const { makeList } = require('./services/list-config');
const { makeInit } = require('./services/make-init');

const makeRun = ({ stage, interactive, getSettings, parameterStore }) => () => {

  return getSettings()
  .tap((settings) => {
    if (!settings.config) { return; }

    const config = settings.config;
    config.defaults = Object.assign({}, config.defaults, settings.outputs);

    const overrides = config[stage];

    return populateConfig({
      settings,
      config,
      overrides,
      interactive,
      parameterStore
    });
  })
  .then(settings => {
    if (!settings.secret) { return; }

    return populateSecret({
      settings,
      secret: settings.secret,
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
    list: makeList({ getSettings, parameterStore }),
    init: makeInit({ getSettings })
  };
};

module.exports = { makeOprah };
