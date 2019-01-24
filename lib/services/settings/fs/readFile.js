'use strict';

const fs = require('fs');

const { parse } = require('./parse');

const readFile = ({ filePath }) => {
  const contents = fs.readFileSync(filePath, 'utf8');

  return parse({ filePath, contents });
};

module.exports = { readFile };
