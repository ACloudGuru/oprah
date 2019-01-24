const Bluebird = require('bluebird');
const get = require('lodash.get');

const makeGetAllParameters =
({ getLatestVersion }) =>
  ({ parameterNames }) => {

    const accumulateParameters = parameters => parameters.reduce((acc, parameterObject) => {
      const parameterPath = get(parameterObject, 'Name') || '';
      const key = parameterPath.split('/').pop();
      const value = get(parameterObject, 'Value')

      if (!key || !value) {
        return acc;
      }

      return Object.assign({}, acc, { [key]: value });
    }, {});

    return Bluebird.all(parameterNames.map(parameterName => {
      return getLatestVersion({ parameterName })
      .then(Item => ({
        Name: parameterName,
        Value: get(Item, 'value') || null
      }))
    }))
    .then(accumulateParameters);
  }

module.exports = {
  makeGetAllParameters
};
