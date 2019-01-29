const chalk = require('chalk');
const { log } = require('../../utils/logger');

const makeUpdateConfigs =
({ getProviderStore }) =>
  ({ parameters }) => {
    log(chalk.gray(`Updating config...`));

    return getProviderStore()
      .then(providerStore => providerStore.updateConfigs({
        parameters,
        onComplete: ({ name, value, version }) => {
          log(chalk.gray(`Updated config: Name: ${name} | Value: [${value}] | Version: [${version}]`));
        }
      }))
      .then(() => {
        log(chalk.gray(`Config updated`));
      });
  };

module.exports = {
  makeUpdateConfigs
};
