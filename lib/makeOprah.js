'use strict';

const chalk = require('chalk');
const { log } = require('../lib/utils/logger');
const { populateConfig, populateSecret } = require('./services');
const { makeParameterStore } = require('./services/parameter-store/make-parameter-store');
const { makeSettingsService } = require('./services/settings/make-settings-service');
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

const makeOprah = ({ params }) => {
  const settingsService = makeSettingsService({
    settingsFilePath: params.config,
    variables: params.variables
  });
  const parameterStore = makeParameterStore({
    getSettings: settingsService.getSettings
  });

  log(chalk.gray(`Stage  --> ${params.stage}`));
  log(chalk.gray(`Config --> ${params.config}`));
  log(chalk.cyan(`Running Oprah in ${params.interactive ? 'interactive' : 'non-interactive'} mode..`));

  return {
    run: makeRun({
      interactive: params.interactive,
      stage: params.stage,
      getSettings: settingsService.getSettings,
      parameterStore
    }),
    list: makeList({
      getSettings: settingsService.getSettings,
      parameterStore
    }),
    init: makeInit({
      getSettings: settingsService.getSettings
    })
  };
};

module.exports = { makeOprah };
