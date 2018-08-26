'use strict';

const path = require('path');

const { readFile } = require('../fs/readFile');
const { OprahError } = require('../error/OprahError');

const deepMap = require('deep-map');
const template = require('lodash.template');

const getConfig = ({ configFile, variables }) => {
  const filePath = path.resolve(__dirname, `../../../${configFile}`);

  try {
    const config = readFile({ filePath });

    return deepMap(config, value => template(value)(variables));
  } catch(error) {
    throw new OprahError(`Could not read config file!! ${error.message}`);
  }
};

module.exports = { getConfig };
