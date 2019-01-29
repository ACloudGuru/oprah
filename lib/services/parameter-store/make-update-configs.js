const chalk = require('chalk');
const { log } = require('../../utils/logger');

const makeUpdateConfigs =
({ getProviderStore }) =>
  ({ parameters }) => {
    return getProviderStore()
      .then(providerStore => providerStore.updateConfigs({
        parameters,
        onComplete: ({ name, value, version }) => {
          log(chalk.gray(`Updated config: Name: ${name} | Value: [${value}] | Version: [${version}]`));
        }
      }));
  };

module.exports = {
  makeUpdateConfigs
};
