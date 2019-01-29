const Bluebird = require('bluebird');
const { sortParameters } = require('./sort-parameters');

const makeGetParameters =
({ getProviderStore }) =>
  ({ parameterNames = [] }) => {
    if(!parameterNames.length) {
      return Bluebird.resolve({});
    }

    return getProviderStore()
      .then(providerStore => providerStore.getAllParameters({ parameterNames }))
      .then(sortParameters);
  };

module.exports = {
  makeGetParameters
};
