const get = require('lodash.get');
const Bluebird = require('bluebird');

const ALLOWED_PROVIDERS = ['ssm', 'ddb'];

const isAllowedProvider = config => {
  const providerName = get(config, 'provider.name');

  if (!ALLOWED_PROVIDERS.includes(providerName)) {
    throw new Error(`Invalid provider '${providerName}'!! Only ${ALLOWED_PROVIDERS} are supported.`);
  }
}

const validateProvider = config => {
  const provider = get(config, 'provider');
  const name = get(provider, 'name');

  if (name === 'ddb') {
    const tableName = get(provider, 'tableName');

    if (!tableName) {
      throw new Error(`Invalid provider!! 'provider.tableName' must be passed for 'ddb' provider.`);
    }
  }
};

const validators = [
  isAllowedProvider,
  validateProvider
];

const getValidatedSettings = ({ config }) => {
  for (const validator of validators) {
    validator(config);
  }

  return Bluebird.resolve(config);
};

module.exports = { getValidatedSettings };
