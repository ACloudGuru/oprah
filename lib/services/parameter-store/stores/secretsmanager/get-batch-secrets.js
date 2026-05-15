const get = require('lodash/get');
const { getSecretsManagerClient } = require('./get-secretsmanager-client');

const getSecretValue = async ({ secretId }) => {
  const client = getSecretsManagerClient();

  try {
    const res = await client.getSecretValue({ SecretId: secretId }).promise();
    return get(res, 'SecretString') || '';
  } catch (err) {
    if (err.code === 'ResourceNotFoundException') {
      return '';
    }
    throw err;
  }
};

const getBatchSecrets = ({ parameterNames }) =>
  Promise.all(parameterNames.map(secretId => getSecretValue({ secretId })));

module.exports = {
  getBatchSecrets
};
