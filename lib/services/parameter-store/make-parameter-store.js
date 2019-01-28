'use strict';

const Bluebird = require('bluebird');
const chalk = require('chalk');

const { sortParameters } = require('./sort-parameters');
const { makeGetProviderStore } = require('./make-get-provider-store');
const { log } = require('../../utils/logger');

const makeParameterStore = ({ settingsService }) => {
    const getProviderStore = makeGetProviderStore({ settingsService });

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
