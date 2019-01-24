'use strict';

const chalk = require('chalk');
const path = require('path');
const { log } = require('../lib/utils/logger');
const { makeParameterStore } = require('./services/parameter-store/make-parameter-store');
const { makeSettingsService } = require('./services/settings/make-settings-service');
const { makeCfService } = require('./services//cf/make-cf-service');
const { makeList } = require('./commands/list/make-list');
const { makeInit } = require('./commands/init/make-init');
const { makeRun } = require('./commands/run/make-run');

const makeOprah = ({ stage, config, variables = {}, interactive = false }) => {
  const cfService = makeCfService();

  config = config ? path.resolve(config) : path.resolve(process.cwd(), 'oprah.yml');

  const settingsService = makeSettingsService({
    settingsFilePath: config,
    variables: Object.assign({}, variables, { stage }),
    cfService
  });

  const parameterStore = makeParameterStore({
    getSettings: settingsService.getSettings
  });

  log(chalk.gray(`Stage  --> ${stage}`));
  log(chalk.gray(`Config --> ${config}`));
  log(chalk.cyan(`Running Oprah in ${interactive ? 'interactive' : 'non-interactive'} mode..`));

  return {
    run: makeRun({
      interactive,
      stage,
      settingsService,
      parameterStore
    }),
    list: makeList({ settingsService, parameterStore }),
    init: makeInit({ settingsService, cfService })
  };
};

module.exports = { makeOprah };
