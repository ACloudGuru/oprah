'use strict';

const Bluebird = require('bluebird');
const { readRemoteConfigs } = require('./secret-store');

const getParameters = ({ path }) => {
  if(!path) {
    return Bluebird.resolve({});
  }

  return readRemoteConfigs({ path })
    .then(configs => Object.keys(configs)
      .sort()
      .reduce((acc, key) => {
        acc[key] = configs[key];
        return acc;
      }, {})
    );
};

module.exports = { getParameters };
