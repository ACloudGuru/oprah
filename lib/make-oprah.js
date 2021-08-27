const chalk = require('chalk');
const path = require('path');
const { log } = require('./utils/logger');
const {
  makeParameterStore
} = require('./services/parameter-store/make-parameter-store');
const {
  makeSettingsService
} = require('./services/settings/make-settings-service');
const { makeCfService } = require('./services/cf/make-cf-service');
const { makeList } = require('./commands/list/make-list');
const { makeRun } = require('./commands/run/make-run');
const { makeExport } = require('./commands/import-export/make-export');
const { makeImport } = require('./commands/import-export/make-import');
const { makeFetch } = require('./commands/fetch/make-fetch');
const { makeInit } = require('./commands/init/make-init');
const { makeConfigure } = require('./commands/configure/make-configure');
const { makeCleanup } = require('./commands/cleanup/make-cleanup');

const makeOprah = ({
  stage,
  config,
  variables = {},
  interactive = false,
  missingOnly = false
}) => {
  const cfService = makeCfService();

  const conf = config
    ? path.resolve(config)
    : path.resolve(process.cwd(), 'oprah.yml');

  const settingsService = makeSettingsService({
    settingsFilePath: conf,
    variables: { ...variables, stage }
  });

  const parameterStore = makeParameterStore({
    settingsService
  });

  log(chalk.gray(`Stage  --> ${stage}`));
  log(chalk.gray(`Config --> ${conf}`));

  const configure = makeConfigure({
    interactive,
    missingOnly,
    stage,
    settingsService,
    parameterStore
  });

  const init = makeInit({ settingsService, cfService });

  const cleanUp = makeCleanup({ parameterStore, settingsService });

  return {
    configure,
    init,
    run: makeRun({ init, configure, cleanUp }),
    list: makeList({ settingsService, parameterStore }),
    export: makeExport({ settingsService, parameterStore }),
    import: makeImport({ settingsService, parameterStore }),
    fetch: makeFetch({ parameterStore, settingsService }),
    cleanUp
  };
};

module.exports = { makeOprah };
