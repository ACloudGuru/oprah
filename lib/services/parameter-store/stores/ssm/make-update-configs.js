const get = require('lodash.get');
const { getSsmClient } = require('./get-ssm-client');

const Bluebird = require('bluebird');
const entries = require('lodash.topairs');

const makeUpdateConfig = ({ getLatestVersion }) =>
  async ({ key, value }) => {
    const ssm = getSsmClient();
    const params = {
      Name: key,
      Type: 'String',
      Value: value,
      Overwrite: true
    };

    const latestValue = await getLatestVersion(key);

    if (latestValue === value) {
      return Bluebird.resolve();
    }

    return ssm.putParameter(params)
      .promise()
      .then(res => ({
        name: key,
        value,
        version: get(res, 'Version')
      }))
      .delay(200);
  }

const makeUpdateConfigs =
({ getLatestVersion }) =>
  ({
    parameters,
    onComplete = () => Promise.resolve()
  }) => {
    const updateConfig = makeUpdateConfig({ getLatestVersion });
    const updaters = entries(parameters).map(([key, value]) => () => updateConfig({ key, value }));
    return Bluebird.mapSeries(updaters, updater => updater().then(onComplete));
  };

module.exports = {
  makeUpdateConfigs
};
