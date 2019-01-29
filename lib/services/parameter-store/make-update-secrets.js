const chalk = require('chalk');
const { log } = require('../../utils/logger');

const makeUpdateSecrets =
({ getProviderStore }) =>
  ({ parameters }) => {
    return getProviderStore()
      .then(providerStore => providerStore.updateSecrets({
        parameters,
        onComplete: ({ name, value, version }) => {
          log(chalk.gray(`Updated secret: Name: ${name} | Value: [${value.length} chars] | Version: [${version}]`));
        }
      }));
  }

module.exports = {
  makeUpdateSecrets
};
