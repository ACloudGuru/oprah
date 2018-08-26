'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');

// const { readFile } = require('./utils/fs/readFile');
const { generateSecretUpdaters } = require('../secret-store');
const { promptRequiredConfigs } = require('../prompt-required-configs');

const populateSecret = ({ path, required, keyId, interactive }) => {
  console.log(chalk.black.bgGreen('Populating secrets in SSM...'));

  if(!path) {
    console.log(chalk.white.bgRed('ssmPath is required!!'));
    return Bluebird.reject(new Error('Please specify ssmPath for populateSecret'));
  }


  return promptRequiredConfigs({ path, required, interactive })
    .then(secrets => {
      const updaters = generateSecretUpdaters({
        secrets,
        path,
        keyId
      });

      return Bluebird.mapSeries(updaters, updater => updater().delay(500));
    });
};

module.exports = {
  populateSecret
};
