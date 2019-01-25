'use strict';

const Bluebird = require('bluebird');
const get = require('lodash.get');
const { makeSsmStore } = require('./stores/ssm/make-ssm-store');
const { makeDdbStore } = require('./stores/ddb/make-ddb-store');

const chalk = require('chalk');
const { log } = require('../../utils/logger');

const makeParameterStore = ({ settingsService }) => {
    const getProviderStore = () => {
      return settingsService.getSettings()
      .then(settings => {
        if (get(settings, 'provider.name') === 'ddb') {
          return makeDdbStore({
            tableName: get(settings, 'provider.tableName')
          });
        }

        if (get(settings, 'provider.name') === 'ssm') {
          return makeSsmStore({});
        }

        throw new Error('Unsupported provider specified');
      });
    }

    const updateSecrets = ({ parameters }) => {
      return getProviderStore()
        .then(providerStore => providerStore.updateSecrets({
          parameters,
          onComplete: ({ key, value }) => {
            log(chalk.gray(`Updated secret: Name: ${key} | Value: [${value.length} chars]`));
          }
        }));
    }

    const updateConfigs = ({ parameters }) => {
      return getProviderStore()
        .then(providerStore => providerStore.updateConfigs({
          parameters,
          onComplete: ({ key, value }) => {
            log(chalk.gray(`Updated config: Name: ${key} | Value: [${value}]`));
          }
        }));
    }

    const sortParameters = parameters => Object.keys(parameters)
      .sort()
      .reduce((acc, key) => {
        acc[key] = parameters[key];
        return acc;
      }, {});

    const getParameters = ({ parameterNames }) => {
      if(!parameterNames.length) {
        return Bluebird.resolve({});
      }

      return getProviderStore()
        .then(providerStore => providerStore.getAllParameters({ parameterNames }))
        .then(sortParameters);
    }

    return {
      updateConfigs,
      updateSecrets,
      getParameters
    }
  }

module.exports = {
  makeParameterStore
};
