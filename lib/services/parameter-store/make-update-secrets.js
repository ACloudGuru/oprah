const chalk = require('chalk');
const { log } = require('../../utils/logger');

const makeUpdateSecrets =
({ getProviderStore }) =>
  ({ parameters }) => {
    log(chalk.gray(`Updating secrets...`));

    return getProviderStore()
      .then(providerStore => providerStore.updateSecrets({
        parameters,
        onComplete: ({ name, value, version }) => {
          log(chalk.gray(`Updated secret: Name: ${name} | Value: [${value.length} chars] | Version: [${version}]`));
        }
      }))
      .then(() => {
        log(chalk.gray(`Secrets updated`));
      });
  }

module.exports = {
  makeUpdateSecrets
};
