'use strict';

const path = require('path');

const { readFile } = require('../fs/readFile');
const { OprahError } = require('../error/OprahError');

const getConfig = ({ fileName = 'oprah.yml' }) => {

  const filePath = path.resolve(__dirname, `../../../${fileName}`);

  try {
    return readFile({ filePath });
  } catch(error) {
    throw OprahError(`Oprah configuration is missing. ${filePath} not found!!`);
  }
};

module.exports = { getConfig };
