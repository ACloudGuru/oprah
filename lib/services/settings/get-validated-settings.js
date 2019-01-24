const get = require('lodash.get');
const Bluebird = require('bluebird');

const ALLOWED_PROVIDERS = ['ssm', 'ddb'];

const isAllowedProvider = provider => ALLOWED_PROVIDERS.includes(provider);

const validators = [
  {
    isValid: config => isAllowedProvider(get(config, 'provider.name')),
    message: (config) => `Invalid provider '${get(config, 'provider.name')}'!! Only ${ALLOWED_PROVIDERS} are supported.`
  }
];

const getValidatedSettings = ({ config }) => {
  for (const validator of validators) {
    if (!validator.isValid(config)) {
      return Bluebird.reject(new Error(validator.message(config)));
    }
  }

  return Bluebird.resolve(config);
};

module.exports = { getValidatedSettings };
