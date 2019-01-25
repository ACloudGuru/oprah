'use strict';

const yaml = require('js-yaml');

const parseYML = contents => yaml.safeLoad(contents, { json: true });

const isYAML = filePath => filePath.endsWith('.yml');

const parse = ({ filePath, contents }) => {
  if (isYAML(filePath)) {
    return parseYML(contents);
  }

  throw new Error('Unsupported file type')
};

module.exports = { parse };
