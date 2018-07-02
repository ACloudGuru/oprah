'use strict';

const chalk = require('chalk');
const yaml = require('js-yaml');
const fs = require('fs');

const readYaml = ({ pathName }) => {
  const defaultOptions = {
    json: true
  };

  try {
    const json = yaml.safeLoad(
      fs.readFileSync(pathName, 'utf8'),
      defaultOptions
    );
    console.log(chalk.blue(`Reading contents: [${pathName}]`));
    return json;

  } catch (e) {
    console.log(chalk.yellow(`Could not read: [${pathName}]`));
  }
  return null;
}

module.exports = {
  readYaml
}