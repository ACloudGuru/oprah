const get = require('lodash.get');

const makeGetAllParameters =
({ getLatestVersion }) =>
  ({ parameterNames }) => {

    const accumulateParameters = parameters => parameters.reduce((acc, parameterObject) => {
      const parameterPath = get(parameterObject, 'Name') || '';
      const key = parameterPath.split('/').pop();

      if (!key) {
        return acc;
      }

      return Object.assign({}, acc, { [key]: get(parameterObject, 'Value') });
    }, {});

    return Promise.all(parameterNames.map(parameterName => {
      return getLatestVersion({ parameterName })
      .then(Value => ({
        Name: parameterName,
        Value
      }))
    }))
    .then(accumulateParameters);
  }

module.exports = {
  makeGetAllParameters
};
