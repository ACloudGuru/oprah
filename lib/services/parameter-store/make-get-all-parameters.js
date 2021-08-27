const makeGetAllParameters = ({ getProviderStore }) => async ({ path }) => {
  if (!path) {
    throw new Error('Missing path!');
  }

  const providerStore = await getProviderStore();

  return providerStore.getAllParametersByPath({ path });
};

module.exports = { makeGetAllParameters };
