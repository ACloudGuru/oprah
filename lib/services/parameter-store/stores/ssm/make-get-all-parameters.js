'use strict';

const get = require('lodash.get');

const makeGetAllParameters =
({ loader }) =>
  ({ parameterNames }) => {
    return loader.loadMany(parameterNames)
    .then(parameters => parameters.reduce(
      (acc, parameter, index) => {
        const parameterPath = get(parameterNames, index) || '';
        const key = parameterPath.split('/').pop();

        if (!key) {
          return acc;
        }

        return {
          ...acc,
          [key]: parameter
        }
      },
      {}
    ))
  }

module.exports = {
  makeGetAllParameters
};
