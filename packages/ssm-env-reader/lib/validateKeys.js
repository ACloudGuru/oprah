'use strict';

const get = require('lodash.get');
const last = require('lodash.last');
const isUndefined = require('lodash.isundefined');

const validateKeys = (object, paths) => {
  return paths.reduce((acc, path) => {
    const value = get(object, path);
    const key = last(path.split('.'));
    if (isUndefined(value)) {
      throw new Error(`Could not find path: ${path}`);
    }

    return Object.assign(
      {},
      acc,
      {
        [key]: value
      }
    );
  }, {});
};

module.exports = { validateKeys };
