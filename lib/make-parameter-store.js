'use strict';

const Bluebird = require('bluebird');
const get = require('lodash.get');
const ssmStore = require('./stores/ssm');
const ddbStore = require('./stores/ddb');

const chalk = require('chalk');
const { log } = require('./utils/logger');

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

          return ssmStore.updateSecrets({
            secrets,
            path,
            onComplete: ({ key, value }) => {
              log(chalk.gray(`Updated secret: Name: ${key} | Value: [${value.length} chars]`));
            }
          });
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

          return ssmStore.updateConfigs({
            configs,
            path,
            onComplete: ({ key, value }) => {
              log(chalk.gray(`Updated config: Name: ${key} | Value: [${value}]`));
            }
          });
        })
    }

    const readRemoteConfigs = ({ parameterNames }) => {
      return getProvider()
        .then(provider => {
          if (provider.name === 'ddb') {
            return ddbStore.getAllParameters({
              // path,
              tableName: get(provider, 'tableName')
            });
          }

          return ssmStore.getAllParameters({ parameterNames })
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
