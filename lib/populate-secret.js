'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');

const { readFile } = require('./utils/fs/readFile');
const { generateSecretUpdaters } = require('./secret-store');
const { promptRequiredConfigs } = require('./prompt-required-configs');

const populateSecret = ({ requiredPath, ssmPath, keyId, noninteractive }) => {
  console.log(chalk.black.bgGreen('Populating secrets in SSM...'));

  if(!ssmPath) {
    console.log(chalk.white.bgRed('ssmPath is required!!'));
    return Bluebird.reject(new Error('Please specify ssmPath for populateSecret'));
  }

  const requiredConfigs = readFile({ filePath: requiredPath });

  return promptRequiredConfigs({ ssmPath, requiredConfigs, noninteractive })
    .then(secrets => {
      const updaters = generateSecretUpdaters({
        secrets,
        ssmPath,
        keyId
      });

      return Bluebird.mapSeries(updaters, updater => updater().delay(500));
    });
};

module.exports = {
  populateSecret
};
