const chalk = require('chalk');
const { log } = require('../../utils/logger');

const makeUpdateConfigs =
({ getProviderStore }) =>
  ({ parameters }) => {
    return getProviderStore()
      .then(providerStore => providerStore.updateConfigs({
        parameters,
        onComplete: ({ key, value }) => {
          log(chalk.gray(`Updated config: Name: ${key} | Value: [${value}]`));
        }
      }));
  };

module.exports = {
  makeUpdateConfigs
};
