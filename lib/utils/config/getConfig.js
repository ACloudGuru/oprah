'use strict';

const path = require('path');

const { readFile } = require('../fs/readFile');
const { interpolate } = require('./interpolate');

const deepMap = require('deep-map');

const getConfig = ({ configFile, variables }) => {
  const filePath = path.resolve(__dirname, `../../../${configFile}`);

  try {
    const config = readFile({ filePath });

    return deepMap(config, value => interpolate({ value, variables }));
  } catch(error) {
    throw new Error(`Could not read config file!! ${error.message}`);
  }
};

module.exports = { getConfig };
