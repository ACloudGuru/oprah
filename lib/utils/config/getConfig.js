'use strict';

const path = require('path');

const { readFile } = require('../fs/readFile');
const { OprahError } = require('../error/OprahError');
const { interpolate } = require('./interpolate');

const getConfig = ({ configFile, variables }) => {
  const filePath = path.resolve(__dirname, `../../../${configFile}`);

  try {
    const config = readFile({ filePath });

    return interpolate({ values: config, variables });
  } catch(error) {
    throw new OprahError(`Could not read config file!! ${filePath} not found.`);
  }
};

module.exports = { getConfig };
