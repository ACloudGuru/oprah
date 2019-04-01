'use strict';

const values = require('lodash.values');
const get = require('lodash.get');

const makeFetch = ({ parameterStore }) => {
    return ({ key }) => parameterStore.getParameters({
        parameterNames: [key]
      })
      .then(parameters => {
        const parameterValues = values(parameters);
        const value = get(parameterValues, '0')

        if (!value) {
          throw new Error('Could not find value');
        }

        return value;
      })
      .then(value => process.stdout.write(value));
}

module.exports = {
  makeFetch
};
