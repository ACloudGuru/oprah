const get = require('lodash/get');
const { getSecretsManagerClient } = require('./get-secretsmanager-client');

const putOrCreateSecret = async ({ key, value }) => {
  const client = getSecretsManagerClient();

  try {
    return await client
      .putSecretValue({ SecretId: key, SecretString: value })
      .promise();
  } catch (err) {
    if (err.code !== 'ResourceNotFoundException') {
      throw err;
    }
    return client.createSecret({ Name: key, SecretString: value }).promise();
  }
};

const makeUpdateSecret = ({ getLatestVersion, onComplete }) => async ({
  key,
  value
}) => {
  const latestValue = await getLatestVersion(key);

  if (latestValue === value) {
    return Promise.resolve();
  }

  const res = await putOrCreateSecret({ key, value });

  return onComplete({
    name: key,
    value,
    version: get(res, 'VersionId')
  });
};

const makeUpdateSecrets = ({
  getLatestVersion,
  getAllParametersByNames
}) => async ({ parameters, onComplete = () => Promise.resolve() }) => {
  const parameterNames = Object.keys(parameters);
  await getAllParametersByNames({ parameterNames });

  const updateSecret = makeUpdateSecret({ getLatestVersion, onComplete });

  const updaters = Object.entries(parameters).map(([key, value]) => () =>
    updateSecret({ key, value })
  );

  return Promise.all(updaters.map(updater => updater()));
};

module.exports = {
  makeUpdateSecrets
};
