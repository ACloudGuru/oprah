const { sortParameters } = require('./sort-parameters');

const makeGetParameters = ({ getProviderStore }) => ({
  parameterNames = []
}) => {
  if (!parameterNames.length) {
    return Promise.resolve({});
  }

  return getProviderStore()
    .then(providerStore =>
      providerStore.getAllParametersByNames({ parameterNames })
    )
    .then(sortParameters);
};

module.exports = {
  makeGetParameters
};
