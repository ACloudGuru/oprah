'use strict';

const chalk = require('chalk');
const path = require('path');
const { log } = require('../lib/utils/logger');
const { makeParameterStore } = require('./services/parameter-store/make-parameter-store');
const { makeSettingsService } = require('./services/settings/make-settings-service');
const { makeCfService } = require('./services/cf/make-cf-service');
const { makeList } = require('./commands/list/make-list');
const { makeRun } = require('./commands/run/make-run');
const { makeExport } = require('./commands/import-export/make-export');
const { makeImport } = require('./commands/import-export/make-import');
const { makeFetch } = require('./commands/fetch/make-fetch');
const { makeInit } = require('./commands/init/make-init');
const { makeConfigure } = require('./commands/configure/make-configure');

const makeOprah = ({ stage, config, variables = {}, interactive = false }) => {
  const cfService = makeCfService();

  config = config ? path.resolve(config) : path.resolve(process.cwd(), 'oprah.yml');

  const settingsService = makeSettingsService({
    settingsFilePath: config,
    variables: Object.assign({}, variables, { stage }),
    cfService
  });

  const parameterStore = makeParameterStore({
    settingsService
  });

  log(chalk.gray(`Stage  --> ${stage}`));
  log(chalk.gray(`Config --> ${config}`));

  const configure = () => {
    log(chalk.cyan(`Running Oprah in ${interactive ? 'interactive' : 'non-interactive'} mode..`));

    return makeConfigure({
      interactive,
      stage,
      settingsService,
      parameterStore
    })();
  };

  const init = makeInit({ settingsService, cfService });

  return {
    configure,
    init,
    run: makeRun({ init, configure }),
    list: makeList({ settingsService, parameterStore }),
    export: makeExport({ settingsService, parameterStore }),
    import: makeImport({ settingsService, parameterStore }),
    fetch: makeFetch({ parameterStore })
  };
};

module.exports = { makeOprah };
