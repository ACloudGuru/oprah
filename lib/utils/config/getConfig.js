'use strict';

const Bluebird = require('bluebird');
const { readFile } = require('../fs/readFile');
const { interpolate } = require('./interpolate');

const deepMap = require('deep-map');

const getConfig = ({ configFile, variables }) => {
  const filePath = configFile;

  try {
    const config = readFile({ filePath });

    return Bluebird.resolve(deepMap(config, value => interpolate({ value, variables })));
  } catch(error) {
    return Bluebird.reject(new Error(`Could not find oprah.yml in the following directory - ${process.cwd()}`));
  }
};

module.exports = { getConfig };
