const get = require('lodash.get');
const { getSsmClient } = require('./get-ssm-client');

const Bluebird = require('bluebird');

const makeUpdateSecret = ({ getLatestVersion, onComplete }) =>
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
      .then(onComplete)
      .delay(250);
  }

const makeUpdateSecrets =
({ getLatestVersion, getAllParameters }) =>
  async ({
    parameters,
    onComplete = () => Bluebird.resolve()
  }) => {
    const parameterNames = Object.keys(parameters);
    await getAllParameters({ parameterNames }); // to cache dataloader;

    const updateSecrets = makeUpdateSecret({ getLatestVersion, onComplete });
    const updaters = Object.entries(parameters).map(([key, value]) => () => updateSecrets({ key, value }));
    return Bluebird.mapSeries(updaters, updater => updater());
  };

module.exports = {
  makeUpdateSecrets
};
