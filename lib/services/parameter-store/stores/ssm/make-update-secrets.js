const get = require('lodash.get');
const { getSsmClient } = require('./get-ssm-client');

const Bluebird = require('bluebird');
const entries = require('lodash.topairs');

const makeUpdateSecret = ({ getLatestVersion }) =>
  async ({ key, value }) => {
    const ssm = getSsmClient();
    const params = {
      Name: key,
      Type: 'SecureString',
      Value: value,
      Overwrite: true,
      KeyId: 'alias/aws/ssm'
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
      .delay(250);
  }

const makeUpdateSecrets =
({ getLatestVersion }) =>
  async ({
    parameters,
    onComplete = () => Bluebird.resolve()
  }) => {
    const updateSecrets = makeUpdateSecret({ getLatestVersion });
    const updaters = entries(parameters).map(([key, value]) => () => updateSecrets({ key, value }));
    return Bluebird.mapSeries(updaters, updater => updater().then(onComplete));
  };

module.exports = {
  makeUpdateSecrets
};
