const get = require('lodash/get');
const { getSsmClient } = require('./get-ssm-client');

const makeUpdateConfig = ({ getLatestVersion, onComplete }) => async ({
  key,
  value
}) => {
  const ssm = getSsmClient();
  const params = {
    Name: key,
    Type: 'String',
    Value: value,
    Overwrite: true
  };

  const latestValue = await getLatestVersion(key);

  if (latestValue === value) {
    return Promise.resolve();
  }

  return ssm
    .putParameter(params)
    .promise()
    .then(res => ({
      name: key,
      value,
      version: get(res, 'Version')
    }))
    .then(onComplete);
};

const makeUpdateConfigs = ({
  getAllParametersByNames,
  getLatestVersion
}) => async ({ parameters, onComplete = () => Promise.resolve() }) => {
  const parameterNames = Object.keys(parameters);
  await getAllParametersByNames({ parameterNames }); // to cache dataloader;

  const updateConfig = makeUpdateConfig({ getLatestVersion, onComplete });

  const updaters = Object.entries(parameters).map(([key, value]) => () =>
    updateConfig({ key, value })
  );

  return Promise.all(updaters.map(updater => updater()));
};

module.exports = {
  makeUpdateConfigs
};
