const { getSsmClient } = require('./get-ssm-client');

const Bluebird = require('bluebird');
const entries = require('lodash.topairs');

function makeUpdateSecret({ path, key, value }) {
  const ssm = getSsmClient();

  const Name = `${path}/${key}`;
  const params = {
    Name,
    Type: 'SecureString',
    Value: value,
    Overwrite: true,
    KeyId: 'alias/aws/ssm'
  };

  return () => ssm.putParameter(params)
    .promise()
    .then(() => ({ key, value }));
}

const makeUpdateSecrets =
() =>
  ({
    secrets,
    path,
    onComplete = () => Promise.resolve()
  }) => {
    const updaters = entries(secrets).map(([key, value]) => makeUpdateSecret({ path, key, value }));
    return Bluebird.mapSeries(updaters, updater => updater().then(onComplete).delay(500));
  };

module.exports = {
  makeUpdateSecrets
};
