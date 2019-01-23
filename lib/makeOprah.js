'use strict';

const chalk = require('chalk');
const { log } = require('../lib/utils/logger');
const { makeParameterStore } = require('./services/parameter-store/make-parameter-store');
const { makeSettingsService } = require('./services/settings/make-settings-service');
const { makeList } = require('./commands/list/make-list');
const { makeInit } = require('./commands/init/make-init');
const { makeRun } = require('./commands/run/make-run');

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
