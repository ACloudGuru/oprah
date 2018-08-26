'use strict';

const path = require('path');

const { readFile } = require('../fs/readFile');
const { OprahError } = require('../error/OprahError');

const getConfig = ({ fileName = 'oprah.yml' }) => {

  const filePath = path.resolve(__dirname, `../../../${fileName}`);
  console.log(filePath);

  try {
    return readFile({ filePath });
  } catch(error) {
    throw new OprahError(`Could not read config file!! ${filePath} not found.`);
  }
};

module.exports = { getConfig };
