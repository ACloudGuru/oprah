'use strict';

const get = require('lodash.get');
const ssmStore = require('./stores/ssm');
const ddbStore = require('./stores/ddb');

const chalk = require('chalk');
const { log } = require('./utils/logger');

// function upload(params) {
//   const outputLog = params.Type === 'SecureString' ?
//     () => log(chalk.gray(`Updating secret: Name: ${params.Name} | Value: [${params.Value.length} chars]`)) :
//     () => log(chalk.gray(`Updating config: Name: ${params.Name} | Value: [${params.Value}]`));

//   outputLog();
//   return ssm.putParameter(params).promise();
// }



const makeParameterStore = ({ getSettings }) => {
    const getProvider = () => {
      return getSettings()
      .then(settings => get(settings, 'provider') || {});
    }

    const updateSecrets = ({ path, secrets }) => {
      return getProvider()
        .then(provider => {
          if (provider.name === 'ddb') {
            return ddbStore.updateSecrets({
              path,
              secrets
            });
          }
          return ssmStore.updateSecrets({ secrets, path });
        });
    }

    const updateConfigs = ({ path, configs }) => {
      return getProvider()
        .then(provider => {
          if (provider.name === 'ddb') {
            return ddbStore.updateConfigs({
              path,
              configs
            });
          }

          return ssmStore.updateConfigs({ configs, path });
        })
    }

    const readRemoteConfigs = ({ path }) => {
      return getProvider()
        .then(provider => {
          if (provider.name === 'ddb') {
            return ddbStore.getAllParameters({
              path,
              tableName: get(provider, 'tableName')
            });
          }

          return ssmStore.getAllParameters({ path })
        })
    }

    return {
      updateConfigs,
      updateSecrets,
      readRemoteConfigs
    }
  }

module.exports = {
  makeParameterStore
};
