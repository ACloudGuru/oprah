const { sortParameters } = require('./sort-parameters');

const makeGetAllParameters = ({ getProviderStore }) => async ({ path }) => {
  if (!path) {
    throw new Error('Missing path!');
  }

  const providerStore = await getProviderStore();

  const parameters = await providerStore.getAllParametersByPath({ path });

  return sortParameters(parameters);
};

module.exports = { makeGetAllParameters };
