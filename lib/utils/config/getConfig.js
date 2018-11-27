'use strict';

const path = require('path');
const root = require('root-path');

const Bluebird = require('bluebird');
const { readFile } = require('../fs/readFile');
const { interpolate } = require('./interpolate');

const deepMap = require('deep-map');

const getConfig = ({ configFile, variables }) => {
  const filePath = path.resolve(root(), configFile);

  try {
    const config = readFile({ filePath });

    return Bluebird.resolve(deepMap(config, value => interpolate({ value, variables })));
  } catch(error) {
    return Bluebird.reject(new Error(`Could not read config file!! ${error.message}`));
  }
};

module.exports = { getConfig };
