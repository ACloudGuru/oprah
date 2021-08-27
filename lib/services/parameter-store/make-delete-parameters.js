const chalk = require('chalk');
const { log } = require('../../utils/logger');

const makeDeleteParameters = ({ getProviderStore }) => async ({
  parameterNames
}) => {
  log(chalk.gray(`Cleanup --> Deleting unused parameters...`));
  const providerStore = await getProviderStore();

  return providerStore
    .deleteParameters({ parameterNames })
    .then(() => log(chalk.gray('Cleanup --> All orphan parameters deleted')));
};

module.exports = { makeDeleteParameters };
