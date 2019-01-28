const chalk = require('chalk');
const { log } = require('../../utils/logger');

const makeUpdateSecrets =
({ getProviderStore }) =>
  ({ parameters }) => {
    return getProviderStore()
      .then(providerStore => providerStore.updateSecrets({
        parameters,
        onComplete: ({ key, value }) => {
          log(chalk.gray(`Updated secret: Name: ${key} | Value: [${value.length} chars]`));
        }
      }));
  }

module.exports = {
  makeUpdateSecrets
};
