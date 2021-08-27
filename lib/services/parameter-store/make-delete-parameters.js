const chalk = require('chalk');
const { log } = require('../../utils/logger');

const makeDeleteParameters = ({ getProviderStore }) => async ({
  parameterNames
}) => {
  log(chalk.gray(`Deleting unused parameters...`));
  const providerStore = await getProviderStore();

  return providerStore
    .deleteParameters({ parameterNames })
    .then(() => log(chalk.gray('Parameters deleted')));
};

module.exports = { makeDeleteParameters };
